import { getActiveTabURL } from "./utils.js";


(function initValue() {
    GetValueOnOffApp();

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type === "ERROR_CHECK_URL") {
            UpdateCountUrl();
        }
        if (obj.type === "ERROR_CHECK_WORD") {
            UpdateCountWord();
        }
    });
})();


const btnToggleApp = document.querySelector(".fa-power-off");
btnToggleApp.addEventListener("click", (event) => {
    const activeTab = getActiveTabURL();
    const textBtnToggle = document.querySelector(".toggleApp__title");
    let arrayClassListEvent = event.target.classList;
    let isCheckBtnActive = false;
    arrayClassListEvent.forEach((item) => {
        if (item === 'active__btn') {
            // Nếu có thì tắt đi
            arrayClassListEvent.remove('active__btn');
            isCheckBtnActive = true;// Đã tắt
            textBtnToggle.innerHTML = "Turn on extension";
            chrome.action.setBadgeText({
                tabId: activeTab.id,
                text: "OFF",
            });
        }
    })

    if (!isCheckBtnActive) {
        arrayClassListEvent.add('active__btn');
        textBtnToggle.innerHTML = "Turn off extension";
        chrome.action.setBadgeText({
            tabId: activeTab.id,
            text: "ON",
        });
    }
})

// bắt sự kiện setting 
const btnSetting = document.querySelector(".setting");
btnSetting.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    var myid = await chrome.runtime.id;
    chrome.tabs.create({ url: "pageSetting/setting.html" });
})

async function GetValueOnOffApp() {
    const activeTab = getActiveTabURL();
    await chrome.storage.local.get(["active_app"], function (result) {
        if (result === undefined) {
            chrome.storage.local.set({ 'active_app': "ON" }, function () {
                console.log('Dữ liệu đã được lưu trữ');
                chrome.action.setBadgeText({
                    tabId: activeTab.id,
                    text: "ON",
                });
                btnToggleApp.classList.add("active__btn");
                const textBtnToggle = document.querySelector(".toggleApp__title");
                textBtnToggle.innerHTML = "Turn off extension";
            });
        } else {
            if (result["active_app"] === "ON") {
                chrome.action.setBadgeText({
                    tabId: activeTab.id,
                    text: "ON",
                });
                btnToggleApp.classList.add("active__btn");
                const textBtnToggle = document.querySelector(".toggleApp__title");
                textBtnToggle.innerHTML = "Turn off extension";
            } else {
                chrome.action.setBadgeText({
                    tabId: activeTab.id,
                    text: "ON",
                });
                btnToggleApp.classList.remove("active__btn");
                const textBtnToggle = document.querySelector(".toggleApp__title");
                textBtnToggle.innerHTML = "Turn on extension";
            }
        }
    });
}


function UpdateCountUrl() {
    const NumberUrl = document.querySelector(".statisBlock__numberUrl__number p");
    chrome.storage.local.get(["count_url"]).then(result => {
        NumberUrl.innerHTML = result["count_url"];
    })
}
function UpdateCountWord() {
    const NumberUrl = document.querySelector(".statisBlock__numberWord__number p");
    chrome.storage.local.get(["count_word"]).then(result => {
        NumberUrl.innerHTML = result["count_wordcount_word"];
    })
}









