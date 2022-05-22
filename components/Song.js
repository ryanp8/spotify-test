import { Heading, Td, Tr } from '@chakra-ui/react';
import ReactAudioPlayer from 'react-audio-player';
import { useEffect, useState } from 'react';

const Song = ({ data }) => {

    const [artists, setArtists] = useState('');
    const [duration, setDuration] = useState((data.duration_ms) / 1000);


    useEffect(() => {
        if (data.artists.length > 1) {
            let str = '';
            data.artists.forEach(artist => {
                str += artist.name + ', ';
            })
            str = str.slice(0, -2)
            setArtists(str);
        }
        else {
            setArtists(data.artists[0].name)
        }

    }, [data])

    return (
        <Tr>
            <Td><a href={data.external_urls.spotify}>{data.name}</a></Td>
            <Td>{artists}</Td>
            <Td>
                <ReactAudioPlayer
                    src={data.preview_url}
                    controls
                ></ReactAudioPlayer>
            </Td>
            <Td>{Math.floor(duration / 60)}:{Math.floor(duration % 60)}</Td>
            <Td>{data.popularity}</Td>

        </Tr>
    )
}

export default Song;