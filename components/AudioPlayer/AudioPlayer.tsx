import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';


const AudioPlayer = ({ soundURI }) => {

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [paused, setPaused] = useState(true);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    useEffect(() => {
        loadSound();
        () => {
            // unload sound
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [soundURI])

    const loadSound = async () => {
        if (!soundURI) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(
            { uri: soundURI },
            {},
            onPlaybackStatusUpdate);
        setSound(sound);
    };


    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            return;
        }
        setAudioProgress(status.positionMillis / (status.durationMillis || 1));
        setPaused(!status.isPlaying);
        setAudioDuration(status.durationMillis || 0);
    };

    const getDuration = () => {
        const minutes = Math.floor(audioDuration / (60 * 1000));
        const seconds = Math.floor((audioDuration % (3600 * 1000)) / 1000);
        return `${minutes}:${seconds ? "0" : ""}${seconds}`;
    };

    const playPauseSound = async () => {
        if (!sound) {
            return;
        }
        if (paused) {

            await sound.playFromPositionAsync(0);

        } else {

            await sound.pauseAsync();

        }


    };


    return (
        <View style={styles.sendAudioConatainer} >
            <Pressable onPress={playPauseSound}>
                <Feather name={paused ? "play" : 'pause'} size={24} color="black" />
            </Pressable>

            <View style={styles.audiProgressBG}>
                <View style={[
                    styles.audioProgressFG,
                    { left: `${audioProgress * 100}%` },
                ]} />


            </View>

            <Text>{getDuration()}</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    root: {
        padding: 10,
    },
    row: {
        flexDirection: 'row',

    },
    inputContainer: {
        backgroundColor: '#f2f2f2',
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#dedede',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
    },
    input: {
        flex: 1,
        marginHorizontal: 5,
    },
    icon: {
        marginHorizontal: 5,
    },
    buttonContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#3777f0',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 35,
    },
    sendImageConatainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignSelf: "stretch",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
    },
    sendAudioConatainer: {
        marginVertical: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",

        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
        backgroundColor: "white",
    },
    audiProgressBG: {
        height: 5,
        flex: 1,
        backgroundColor: "lightgray",
        borderRadius: 5,
        margin: 10,

    },
    audioProgressFG: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#3777f0',

        position: "absolute",
        top: -3,
        left: "50%",

    }
});

export default AudioPlayer