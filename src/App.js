import React, { useState, useEffect } from 'react';
import './styles/App.css'
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import MyButton from './components/UI/button/MyButton';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/MyModal/MyModal';
import Loader from './components/UI/Loader/Loader';
import { usePosts } from './hooks/usePosts'
import PostService from './API/PostService'

function App() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState({ sort: '', query: '' })
  const [modal, setModal] = useState(false)
  const [isPostsLoading, setIsPostsLoading] = useState(false)

  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

  useEffect(() => {
    fetchPosts()
  }, [])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  async function fetchPosts() {
    setIsPostsLoading(true)
    setTimeout(async () => {
      const posts = await PostService.getAll()
      setPosts(posts)
      setIsPostsLoading(false)
    }, 1000)
  }

  const removePost = (post) => {
    setPosts(posts.filter(({ id }) => id !== post.id))
  }

  return (
    <div className='App'>
      <MyButton style={{ marginTop: '30px' }} onClick={() => setModal(true)}>
        Создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }} />
      <PostFilter filter={filter} setFilter={setFilter} />
      {isPostsLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}><Loader/></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Посты про JS' />}
    </div>
  );
}

export default App;
