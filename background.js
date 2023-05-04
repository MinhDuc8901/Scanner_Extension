
(function () {
  CheckCounterNumber();
  CheckOnOrOffApp();
})();


chrome.tabs.onUpdated.addListener(async (tabId, tab) => {// là một phương thức callback khi một tab được cập nhật
  let DataStorage = await GetDataStorage;
  let ActiveApp = await GetValueActivate;
  // if (DataStorage && DataStorage.ListURLs.length > 0) {
  // && !CheckUrlBlackList(tab.url, DataStorage.ListURLs)
  if (tab.url) {
    let check = await PromiseCheckUrl({ "urls": tab.url.replace(new RegExp('^(http(s)?:\/\/)+(www.)'), '') });
    if (check.result[0] == 0) {
      chrome.tabs.sendMessage(tabId, {
        type: "PASS_CHECK_URL",
        data: tab
      });
    } else {
      chrome.tabs.sendMessage(tabId, {
        type: "ERROR_CHECK_URL",
        data: tab
      });
    }
  }
  // await chrome.tabs.sendMessage(tabId, {
  //   type: "CHECK",
  //   data: tab
  // });
  console.log(ActiveApp);
  console.log(tab);
  // if (ActiveApp.active == 'ON') {
  //   if (tab.url) {//check url người dùng không thích
  //     callCheckURLapi({ "urls": tab.url.replace(new RegExp('^(http(s)?:\/\/)+(www.)'), '') }, function (result) {
  //       if (result.result[0] == 0) {
  //         // false là pass
  //         console.log("url qua")
  //         chrome.tabs.sendMessage(tabId, {
  //           type: "PASS_CHECK_URL",
  //           data: tab,
  //         }, function (response) {
  //           console.log(response)
  //         });
  //       } else {
  //         // url đó không quá được
  //         console.log("url không qua")
  //         CounterUrlToxic();
  //         chrome.tabs.sendMessage(tabId, {
  //           type: "ERROR_CHECK_URL",
  //           data: tab
  //         });
  //       }
  //     })
  //     // if (callCheckURLapi({ "urls": tab.url.replace(new RegExp('^(http(s)?:\/\/)+(www.)'), '') }) == false) {// check bằng ai
  //     //   // false là pass
  //     //   console.log("url qua")
  //     //   chrome.tabs.sendMessage(tabId, {
  //     //     type: "PASS_CHECK_URL",
  //     //     data: tab,
  //     //   });
  //     // }
  //     // else {
  //     //   // url đó không quá được
  //     //   console.log("url không qua")
  //     //   CounterUrlToxic();
  //     //   chrome.tabs.sendMessage(tabId, {
  //     //     type: "ERROR_CHECK_URL",
  //     //     data: tab
  //     //   });

  //     // }
  //   }
  // }
  // else {
  //   CounterUrlToxic();
  //   chrome.tabs.sendMessage(tabId, {
  //     type: "ERROR_CHECK_URL",
  //     data: tab
  //   });
  // }
  // }
});



let GetDataStorage = new Promise((resolve, reject) => {
  let dataStorage = {};
  chrome.storage.local.get(["Age", "ListURL", "ListWord"]).then(result => {
    dataStorage.Age = result.Age;
    dataStorage.ListURLs = result.ListURL;
    dataStorage.ListWords = result.ListWord;
  })
  resolve(dataStorage)

});

let GetValueActivate = new Promise((resolve, reject) => {
  let dataStorage = {};
  chrome.storage.local.get(["active_app"]).then(result => {
    dataStorage.active = result.active_app;
    resolve(dataStorage)
  })

});


function CheckUrlBlackList(url, BlackList) {
  BlackList.forEach(item => {
    if (item !== "") {
      if (item === url) {
        return true;
      }
    }
  })
  return false;
}

function CheckOnOrOffApp() {
  const activeTab = getActiveTabURL();
  chrome.storage.local.get(["active_app"]).then(result => {
    if (result["active_app"] === undefined) {
      // set active app turn on
      chrome.storage.local.set({ "active_app": "ON" }).then(() => { });
      chrome.action.setBadgeText({
        tabId: activeTab.id,
        text: "ON",
      });
    } else {
      if (result["active_app"] === "ON") {
        chrome.action.setBadgeText({
          tabId: activeTab.id,
          text: "ON",
        });
      } else {
        chrome.action.setBadgeText({
          tabId: activeTab.id,
          text: "OFF",
        });
      }
    }
  })
}

async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true
  });

  return tabs[0];
}

function CheckCounterNumber() {
  chrome.storage.local.get(["count_url", "count_word"]).then(result => {
    if (!result["count_url"]) {
      chrome.storage.local.set({ "count_url": 0 }).then(() => { });
    }
    if (!result["count_word"]) {
      chrome.storage.local.set({ "count_word": 0 }).then(() => { });
    }
  })
}

function CounterUrlToxic() {
  chrome.storage.local.get(["count_url"]).then(result => {
    if (result) {
      let varCountUrl = Number(result["count_url"]) + 1;
      chrome.storage.local.set({ "count_url": varCountUrl }).then(() => { });
    }
  });
}

async function callCheckURLapi(reqData, callback) {
  try {
    const response = await fetch("http://127.0.0.1:9999/check_url", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });

    const result = await response.json();
    callback(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

function PromiseCheckUrl(reqData) {
  return new Promise(function (resolve, reject) {
    callCheckURLapi(reqData, resolve);
  })
}





