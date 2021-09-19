import React, { useState, useEffect, useRef } from 'react';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import MyButton from '../components/UI/button/MyButton';
import PostFilter from '../components/PostFilter';
import MyModal from '../components/UI/MyModal/MyModal';
import Loader from '../components/UI/Loader/Loader';
import { usePosts } from '../hooks/usePosts'
import { useFetching } from '../hooks/useFetching'
import { useObserver } from '../hooks/useObserver'
import PostService from '../API/PostService'
import { getPageCount } from '../utils/pages';
import Pagination from '../components/UI/pagination/Pagination';
import MySelect from '../components/UI/select/MySelect';

function Posts() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState({ sort: '', query: '' })
  const [modal, setModal] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
  const lastElement = useRef()

  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page)
    setPosts([...posts, ...response.data])
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit))
  })

  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
    setPage(page + 1)
  })

  useEffect(() => {
    fetchPosts()
  }, [page, limit])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(({ id }) => id !== post.id))
  }

  const changePage = (p) => {
    setPage(p)
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
      <MySelect
        value={limit}
        onChange={value => setLimit(value)}
        defaultValue="Количество элементов на странице"
        options={[
          { value: 5, name: '5' },
          { value: 10, name: '10' },
          { value: 25, name: '25' },
          { value: -1, name: 'Показать все' },
        ]} />
      {postError && <h1>Произошла ошибка {postError}</h1>}
      <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Посты про JS' />
      <div ref={lastElement}></div>
      {isPostsLoading
        && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader /></div>
      }
      <Pagination totalPages={totalPages} page={page} changePage={changePage} />
    </div>
  );
}

export default Posts;
