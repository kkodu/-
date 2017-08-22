CasperJS를 사용한 디시인사이드 삼육대 갤러리 크롤링

사용 목적: request 모듈과 cheerio-httpcli 모듈을 사용을 해보았지만 실패. 브라우저 접근 방식이 필요하게 됨.

실행 환경: casperjs 파일이름.js

Phantom.js의 mongoose 모듈을 지원하지 않는 이유로, 타겟 브라우저에서 추출한 데이터를 새로운 파일을 생성하여 그 파일에 저장. 그 다음 node 환경에서 파일을 읽어와 mongodb에 저장. 
