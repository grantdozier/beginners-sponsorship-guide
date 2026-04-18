import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { COLORS } from '../data/content';

const RECORDINGS = [
  {
    title: '5/6/18 Step 4, first column',
    subtitle: 'Tyla',
    file: require('../../assets/audio/STEP4_first_column_audio.m4a'),
  },
  {
    title: '5/13/18 Step 4, second and third column',
    subtitle: 'Tyla',
    file: require('../../assets/audio/STEP4_second_and_third_column_audio.m4a'),
  },
  {
    title: '5/20/28 Step 4, the realization',
    subtitle: 'Tyla',
    file: require('../../assets/audio/STEP4_the_realization.m4a'),
  },
  {
    title: '5/27/18 Step 4, fourth column',
    subtitle: 'Tyla',
    file: require('../../assets/audio/STEP4_fourth_column.m4a'),
  },
];

function formatTime(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  const totalSec = Math.floor(seconds);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function AudioRow({ recording, index }) {
  const player = useAudioPlayer(recording.file, { updateInterval: 0.5 });
  const status = useAudioPlayerStatus(player);

  const currentTime = status.currentTime || 0;
  const duration = status.duration || 0;
  const isPlaying = status.playing;

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleRewind = async () => {
    const newPos = Math.max(0, currentTime - 15);
    await player.seekTo(newPos);
  };

  const handleForward = async () => {
    if (duration) {
      const newPos = Math.min(duration, currentTime + 15);
      await player.seekTo(newPos);
    }
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={styles.audioRow}>
      <View style={styles.audioHeader}>
        <View style={styles.audioNumBadge}>
          <Text style={styles.audioNumText}>{index + 1}</Text>
        </View>
        <View style={styles.audioInfo}>
          <Text style={styles.audioTitle}>{recording.title}</Text>
          <Text style={styles.audioSubtitle}>{recording.subtitle}</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={handleRewind} style={styles.skipBtn}>
          <Text style={styles.skipText}>-15s</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForward} style={styles.skipBtn}>
          <Text style={styles.skipText}>+15s</Text>
        </TouchableOpacity>

        <Text style={styles.timeText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

export default function WorkshopAudioPlayer() {
  return (
    <View>
      <Text style={styles.introText}>
        Listening to these workshop recordings will give you a clear understanding
        of the process. It gets much easier with practice.
      </Text>

      {RECORDINGS.map((rec, i) => (
        <AudioRow key={i} recording={rec} index={i} />
      ))}

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>How to use these recordings</Text>
        <Text style={styles.tipText}>
          To complete the 4th column, click on the right arrow for the 5/27/18
          recording. Have the Mr. Brown worksheet example in hand and follow
          along. Complete the blank forms using the workshop audio as your guide.
        </Text>
        <Text style={[styles.tipText, { marginTop: 8 }]}>
          Allow yourself 20 minutes to complete each inventory in the beginning.
          You will get much quicker with practice. Rewind as many times as needed
          until the process becomes clear. It's not a race. We are asking GOD to
          show us the truth.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  introText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 21,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  audioRow: {
    backgroundColor: COLORS.offWhite || '#F7F7F7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray || '#E0E0E0',
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  audioNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  audioNumText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  audioSubtitle: {
    fontSize: 12,
    color: COLORS.darkGray || '#666',
    marginTop: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  playIcon: {
    fontSize: 18,
    color: '#fff',
  },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E8E8E8',
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.darkGray || '#666',
    marginLeft: 'auto',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.orange,
    borderRadius: 2,
  },
  tipBox: {
    backgroundColor: '#FFF8F0',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F0D8B8',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.orange,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.black,
    lineHeight: 20,
  },
});
