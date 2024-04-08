function observeDOMChanges() {
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        play()
      }
    });
  });

  observer.observe(document.body, config);
}

function play () {
  updateDueDates();
  updateIssueStatusColors();
}

function updateDueDates() {
  const dueDates = document.querySelectorAll('div[data-issuefieldid="duedate"]');
  const now = new Date();
  now.setHours(0, 0, 0, 0); // 현재 날짜의 시간을 00:00:00으로 설정

  dueDates.forEach(dueDate => {
    const dateText = dueDate.textContent.trim();
    const dueDateTime = Date.parse(dateText);

    if (!isNaN(dueDateTime)) {
      const dueDateObject = new Date(dueDateTime);
      dueDateObject.setHours(0, 0, 0, 0); // 만료일의 시간을 00:00:00으로 설정
      const diffDays = Math.round((dueDateObject - now) / (1000 * 60 * 60 * 24)); // 현재 날짜와 만료일 사이의 차이 계산 (일 단위)

      // D-day 메시지 생성
      let dDayMessage;
      if (diffDays < 0) {
        dDayMessage = `기한 지남`; // 기한이 지난 항목
      } else if (diffDays === 0) {
        dDayMessage = `D-day`; // 오늘 만료
      } else {
        dDayMessage = `D-${diffDays}`; // 만료일까지 남은 일수
      }

      // D-day 메시지를 표시하기 위한 요소 생성 및 스타일 설정
      const dDayElement = document.createElement('span');
      dDayElement.textContent = ` [${dDayMessage}]`;
      dDayElement.style.fontWeight = 'bold';
      dDayElement.style.marginLeft = '8px';

      // 이전에 추가된 D-day 메시지가 있다면 제거
      if (dueDate.querySelector('.d-day-message')) {
        dueDate.removeChild(dueDate.querySelector('.d-day-message'));
      }

      dDayElement.classList.add('d-day-message'); // 나중에 식별하기 위해 클래스 추가
      dueDate.appendChild(dDayElement); // D-day 메시지 요소를 만료일 옆에 추가
    }
  });
}

function updateIssueStatusColors() {
  const statusElements = document.querySelectorAll('div[data-testid="platform-card.common.ui.custom-fields.card-custom-field.text-card-custom-field-content.field"]');
  
  statusElements.forEach(statusEl => {
    const statusText = statusEl.textContent.trim().toUpperCase();
    
    switch(statusText) {
      case 'DEV':
        statusEl.style.fontWeight = 600;
        statusEl.style.color = '#4A90E2'; // 파란색
        break;
      case 'RELEASE':
        statusEl.style.fontWeight = 600;
        statusEl.style.color = '#7ED321'; // 녹색
        break;
      case 'STG':
        statusEl.style.fontWeight = 600;
        statusEl.style.color = '#D0021B'; // 주황색
        break;
      default:
        statusEl.style.color = '#9B9B9B'; // 기본 색상 (회색)
    }
  });
}

document.addEventListener('DOMContentLoaded', play);
observeDOMChanges();
