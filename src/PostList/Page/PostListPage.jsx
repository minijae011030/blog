import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../Style/postlist.module.css";

import LoadPostListFunction from "../Function/LoadPostListFunction";

import PostList from "../Component/PostList";
import PaginationComponent from "../Component/PaginationComponent";
import Header from "../../Component/Header";

function PostListPage() {
  const navigate = useNavigate();

  const [pinnedPostList, setPinnedPostList] = useState(null);
  const [unPinnedPostList, setUnPinnedPostList] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [activePage, setActivePage] = useState(1);

  async function LoadPostList({ page }) {
    const result = await LoadPostListFunction({ page, size: 5 });

    if (result.result) {
      setPinnedPostList(result.pinnedPostList);
      setUnPinnedPostList(result.unpinnedPostList);
      setTotalCount(Number(result.postCount));

      return;
    }

    alert("오류가 발생하였습니다.");
    navigate("/postlist");
    return;
  }

  function handlePageChange(e) {
    LoadPostList({ page: e });
    setActivePage(e);
  }

  useEffect(() => {
    LoadPostList({ page: 1 });
  }, []);

  if (pinnedPostList || unPinnedPostList) {
    return (
      <>
        <Header />
        <div className={styles.outer_post_box}>
          <p className={styles.box_title}>전체 게시글</p>
          <PostList postList={unPinnedPostList} />
          <PaginationComponent
            totalCount={totalCount}
            onChange={handlePageChange}
            itemsCountPerPage={5}
            activePage={activePage}
          />
        </div>
      </>
    );
  }
}
export default PostListPage;
