
(async () => {

  let data = GetDataStorage();
  console.log("check có chạy hay không");
  console.log(window.location.href);
  CheckURLToxic();

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;
    const elements = document.getElementsByTagName("*");
    console.log("kiểm tra nhận được thông điệp");
    console.log(obj)
    // if (data.ListURLs.length > 0) {
    response("Nhận được dữ liệu gửi sang")
    if (obj.type === "PASS_CHECK_URL") {
      // đọc thẻ html
      ReadAllTagHtml(obj);
    }
    if (obj.type === "ERROR_CHECK_URL") {
      RenderHtmlError();
    }
    // }
  });

})();

function GetDataStorage() {
  let dataStorage = {};
  chrome.storage.local.get(["Age", "ListURL", "ListWord", "active_app"]).then(result => {
    dataStorage.Age = result.Age;
    dataStorage.ListURLs = result.ListURL;
    dataStorage.ListWords = result.ListWord;
    dataStorage.Active = result["active_app"];
  })
  return dataStorage;
}


function ReadAllTagHtml(obj) {
  const elements = document.getElementsByTagName("*");
  const ListBlockWords = [];
  chrome.storage.local.get(["ListWord"]).then(result => {
    if (!result) {
      ListBlockWords = result["ListWord"];
    }
  })
  // Lặp qua từng phần tử và lấy nội dung của chúng
  for (let i = 0; i < elements.length; i++) {
    let text = elements[i].textContent.trim();
    if (text !== "") {
      if (!CheckWordToxic(text, ListBlockWords)) {
        // nếu oke thì gọi url check 
        if (text) {

        } else {
          CounterWordToxic();
          chrome.runtime.sendMessage(obj.data.id, {
            type: "ERROR_CHECK_WORD",
            data: obj
          });
        }
        // không oke thì thôi
      }
    }
  }
}

function RenderHtmlError() {
  document.body.innerHTML = "Không thể truy cập trang";
}

function CheckWordToxic(word, ListWords) {
  ListWords.forEach(item => {
    if (item !== "") {
      let isCheck = item.includes(word);
      if (isCheck) return true;
    }
  });
  return false;
}

function CounterWordToxic() {
  chrome.storage.local.get(["count_word"]).then(result => {
    if (result) {
      let varCountWord = Number(result["count_word"]) + 1;
      chrome.storage.local.set({ "count_word": varCountWord }).then(() => { });
    }
  })
}

function CheckURLToxic() {
  let url = window.location.href;
  console.log(url)
  sendCheckUrl({ "urls": url.replace(new RegExp('^(http(s)?:\/\/)+(www.)'), '') });
}

async function sendCheckUrl(reqData) {
  try {
    const response = await fetch("http://127.0.0.1:9999/check_url", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });

    const result = await response.json();
    if (result.result[0] == 1) {
      RenderHtmlError();
    } else {

    }
  } catch (error) {
    console.error("Error:", error);
  }
}







