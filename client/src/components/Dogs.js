import React, { useEffect, useState, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
function Dogs(props) {
  const [breeds, setBreeds] = useState([])
  const [search, setSearch] = useState('')
  const [images, setImages] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [show, setShow] = useState(true)
  const node = useRef()

  //Get all breeds
  useEffect(() => {
    getBreeds()
  }, [])

  const getBreeds = async () => {
    const promise = await axios.get('http://localhost:3011/breeds')
    const status = promise.status
    if (status === 200) {
      let breedsArr = []
      let dict = promise.data.message
      for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
          breedsArr.push(key)
        }
      }
      setBreeds(breedsArr)
    }
  }

  //Request images of a breed
  const requestImages = async (breed) => {
    axios
      .post('http://localhost:3011/breed/images', {
        breed: breed,
      })
      .then(function (response) {
        let breedImages = response.data.message
        breedImages = breedImages.slice(0, 20)
        setImages(breedImages)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const submitForm = async (e) => {
    e.preventDefault()
    if (breeds.includes(search.toLowerCase())) {
      setSearchResults([])
      requestImages(search)
    }
  }

  //Filter the search
  useEffect(() => {
    if (!search) return setSearchResults([])
    setSearchResults(
      breeds.filter(
        (breed) => breed.toLowerCase().indexOf(search.toLowerCase()) !== -1
      )
    )
  }, [breeds, search, searchResults])

  return (
    <>
      <h1>Dog Breeds</h1>
      <div className='search-container'>
        <Form.Control
          className='searchBar'
          placeholder='Search Breeds'
          value={search}
          onChange={(e) => {
            setShow(true)
            setSearch(e.target.value)
          }}
        />
      </div>
      {show && searchResults.length > 0 && (
        <div className='results-container'>
          <div ref={node} className='search-results'>
            <div>
              {searchResults.map(
                (breed, idx) =>
                  idx < 7 && (
                    <div
                      onClick={() => {
                        setSearch(breed)
                        setShow(false)
                        requestImages(breed)
                      }}
                      className='search-item'
                      key={idx}
                    >
                      {breed}
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}
      <div className='button-container'>
        <div
          className='button-wrapper'
          style={{
            backgroundColor:
              show && searchResults.length > 0 ? 'white' : '#202423',
          }}
        >
          <Button className='sendButton' onClick={submitForm}>
            Search
          </Button>
        </div>
      </div>
      <div className='imgContainer'>
        {images.map((i, index) => (
          <div key={index}>
            <img src={i} alt='dog' />
          </div>
        ))}
      </div>
    </>
  )
}

export default Dogs
