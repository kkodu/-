// all feeds
const showallFeed = $('#show-allfeed');
// feed contents box
const allContents = $('.all-contents');

const prettyDate = moment();
moment.locale('ko');

let fn;
let flag = 0, monthCheck = '00', dayCheck = '00';
let type = 0; // 추후에, 타입에 따른 호출을 위한 변수
let allPageCount = 2; // 스크롤링 시, 카운트
let primaryFeed; // 처음 렌더링 시의 첫 번째 피드를 고정. 날짜별로 분리하기 위해


let getDivideUpdate = function(contents, feed) {
  contents.prepend(getFbText(feed));
}


let compareDate = function(cTime) {
  let now = moment().format('YYYYMMDD000000');
  Number(now);
  if(cTime >= now) {
    return moment(cTime, 'YYYYMMDDhhmmss').fromNow();
  } else {
    return moment(cTime, 'YYYYMMDDhhmmss').format("M월 D일 a h:mm");
  }
}


let getFbText = function(feed, count) {
  let photo = "";
  let time = compareDate(feed.created_time);
  switch(feed.from) {
    case 1:
      photo = "../../images/syu-bamboo.jpg";
      break;
    case 2:
      photo = '../../images/syu-deliver.jpg';
      break;
    case 3:
      photo = '../../images/syu-chonghak.jpg';
      break;
    case 4:
      photo = '../../images/syu-yeonhab.jpg';
      break;
    case 5:
      photo = '../../images/syu-computer.jpg';
      break;
    default:
      photo = '../../images/apeach.jpg';
  }
  if(count === undefined) {
    count = 0;
  }
  let fbText = `
    <li class="card mb-4">
      <div class="card-body">
        <div class="card-profile ovfl">
          <div class="photo-wrap">
            <img src="${photo}" width="42px" height="42px">
          </div>
          <div class="title-wrap">
            <h5 class="card-title">${feed.name}</h5>
            <h5 class="card-time">${time}</h7>
          </div>
        </div>
        <p class="card-text">${textReduce(feed.message)}</p>
      </div>
      <div class="card-footer text-muted ovfl">
          <div class="likes">
            <img src="../../images/fb-like-icon.jpg" width="20px" height="20px" alt="">
            <span class="txt-custom">${feed.likes}</span>
          </div>
          <div class="comments ${feed.storyid} comments-${count}" data-toggle="modal" data-target="#exampleModalLong">
            <img src="../../images/fb-comment-icon.jpg" width="20px" height="20px" alt="">
            <span class="txt-custom">${feed.comments}</span>
          </div>
          <span class="txt-custom text-muted pull-right">
          <a href="${feed.link}">Read More &rarr;</a>
        </span>
      </div>
    </li>
  `;
  return fbText;
}

let getDcText = function(feed) {
  let time = compareDate(feed.created_time);
  let dcText = `
    <li class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">삼육갤</h2>
        <p class="card-text">${feed.message}</p>
        <a href="http://gall.dcinside.com${feed.link}" class="btn btn-primary">Read More &rarr;</a>
      </div>
      <div class="card-footer text-muted">
        ${time}
      </div>
    </li>
  `;
  return dcText;
}

let appendByType = function(contents, feed, count) {
  if(feed.from !== 'not exist') {
    contents.append(getFbText(feed, count));
  } else {
    contents.append(`
      <li class="card mb-4">
        <div class="card-body">
          <h4>피드가 더 존재하지 않습니다.</h4>
        </div>
      </li>
    `);
  }
}

// 초기 온 로드 렌더링
$(() => {
  // 전체 피드들 렌더링
  fn = (result) => {
    primaryFeed = result[0];
    for(let i=0; i<result.length; i++) {
      appendByType(allContents, result[i]);
    }
    // 어떻게 고치니~~
    showMoreText();
    $(".comments").on('click', handler);
  };
  AJAX.allfeedload('http://localhost:3000/dbrender/allfeeds', fn);
});

let scrollFlag = true;
const preloader = function(result) {
  if(result === 'show') {
    $('#loader').show();
  } else {
    $('#loader').hide();
  }
};

// 무한 스크롤링 시 렌더링
$(window).scroll(function(e) {
  // 스크롤이 문서 아래 부분 근처에 왔을 시
  if($(window).scrollTop() >= $(document).height() - $(window).height()) {
    if(scrollFlag) {

      scrollFlag = false; // 접근 제한 플래그
      console.log('[loading..] more feeds');

      preloader('show') // => 로딩 아이콘 보여주기

      setTimeout(function() {
        fn = (result) => {
          preloader('hide'); // 1.2초 후, 로딩 아이콘 숨김
          for(let i=0; i<result.length; i++) {
            appendByType(allContents, result[i], allPageCount);
          }
          showMoreText(); // more(계속읽기) 적용
          $(`.comments-${allPageCount}`).on('click', handler);
          scrollFlag = true; // flag 원래대로 바꾸기
        };
        AJAX.morefeed('http://localhost:3000/dbrender/morefeeds', allPageCount, type, fn); // 타입은 디씨, 페북 나누기 위해
        allPageCount++; // allpage number up
      }, 1300);
    }
  }
});

// 새로 업데이트 된 피드들만 렌더링
const updatedFeedRender = function() {
  fn = (result) => {
    for(let i=result.length-1; i>=0; i--) {
      getDivideUpdate(allContents, result[i]);
    }
    showMoreText();
    $(".comments").on('click', handler);
  };
  AJAX.updatefeed('http://localhost:3000/dbrender/updatefeeds', fn);
};
const checkLoop = setInterval(updatedFeedRender, 20000); // 15초간 간격으로 피드들을 확인 후, 새로 업데이트 된 피드가 있을 시 렌더링
