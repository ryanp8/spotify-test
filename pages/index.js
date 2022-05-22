import { Button, Container, Heading, Input, TableContainer, Table, Thead, Tbody, Tr, Th, HStack, VStack, Flex, Text, Center, Square, Box } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Song from '../components/Song'

const CLIENT_ID = '6e98e9db381048faa1c7f57f13ac2c6d'
const REDIRECT_URI = 'http://localhost:3000'
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"


export default function Home() {

  const [token, setToken] = useState('');
  const [data, setData] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      let t = hash.split('=')[1];
      t = t.split('&')[0];
      setToken(t);

      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${t}`
        }
      }).then(res => res.json()).then(json => { setUsername(json.display_name) });
    }
  }, []);

  const getArtistId = async (e) => {
    e.preventDefault();
    if (token && currentInput) {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${currentInput}&type=artist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const json = await res.json();

      const artistId = json.artists.items[0].id;
      console.log(artistId)
      const songsRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=us`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const songJson = await songsRes.json();
      const tracks = songJson.tracks;
      setData(tracks);
      tracks.forEach(e => { console.log(e) })
    }
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container centerContent marginY='2%'>
        {!token ?
          <Button colorScheme='green'>
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
          </Button>
          :
          <VStack w='full' alignItems='flex-start'>
            <Heading size='lg'>Welcome, {username}</Heading>
            <form onSubmit={getArtistId}>
              <Flex>
                <Input flex='3' marginY='1%' marginRight='2%' type="text" placeholder="Artist" onChange={e => { setCurrentInput(e.target.value) }}></Input>
                <Button flex='1' marginY='1%' width='full' type="submit">
                  Get Artist
                </Button>
              </Flex>
            </form>
          </VStack>
        }
        {/* <div> */}
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Song</Th>
                  <Th>Artist(s)</Th>
                  <Th>Sample</Th>
                  <Th>Duration</Th>
                  <Th>Popularity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data &&
                  data.map((e, i) => <Song key={i} data={e}></Song>)
                }
              </Tbody>
            </Table>
          </TableContainer>
        {/* </div> */}
      </Container>
    </div>
  )
}
