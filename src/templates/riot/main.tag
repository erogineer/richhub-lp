<main>
  <p>main</p>
  <h2 class="title">作品一覧</h2>
  <!-- <div riot-tag="title"></div> -->
  <div class="work-list">
    <div each={ lists } class="work-list-detail">
      <div class="circle"><a href="#">{ title }</a></div>
    </div>
  </div>

  <script>
  this.lists = [
    { title: '作品1' },
    { title: '作品2' },
    { title: '作品2' },
    { title: '作品2' },
    { title: '作品2' },
    { title: '作品3' }
  ]
  </script>
</main>
