
(function () {
    const tabs = document.querySelectorAll(".tab_li");
    const divTab = document.querySelectorAll(".tab");
    createClickTab(tabs, divTab);
    getDataInit();
    AddEvent();

})();

function createClickTab(tabs, divTab) {
    tabs.forEach((item) => {
        item.addEventListener('click', (event) => {
            // remove active 
            tabs.forEach((obj) => {
                obj.classList.remove('active');
            })
            divTab.forEach((obj) => {
                obj.classList.remove("activeTab");
            })

            event.target.classList.add('active');
            const activeTab = document.querySelector("." + event.target.dataset.tab);
            activeTab.classList.add('activeTab');


        })

    })
}

function AddEvent() {
    const btnSubmitUrl = document.querySelector(".BlackListUrl__submit button");
    const btnSubmitWord = document.querySelector(".BlackListWord__submit button");
    const btnSubmitAge = document.querySelector(".Option__submit button");

    btnSubmitUrl.addEventListener("click", (event) => {
        console.log(event);
        const inputBlackListUrl = document.querySelector(".BlackListUrl__content textarea");
        let ListUrl = inputBlackListUrl.value;
        ListUrl = ListUrl.split(";");// chuyển thành mảng và lưu vào trong storage
        chrome.storage.local.set({ "ListURL": ListUrl }).then(() => {
            console.log(ListUrl);
        });
        // chrome.storage.local.get(["ListURL"]).then((result) => {
        //     console.log(result["ListURL"]);
        // });
    });

    btnSubmitWord.addEventListener("click", (event) => {
        const inputBlackListWord = document.querySelector(".BlackListWord__content textarea");
        let ListWord = inputBlackListWord.value.split(";");
        chrome.storage.local.set({ "ListWord": ListWord }).then(() => {
        });
    })

    btnSubmitAge.addEventListener("click", (event) => {
        const inputAge = document.querySelector(".Option__content .form-control");
        let Age = inputAge.value;
        chrome.storage.local.set({ "Age": Age }).then(() => {
            toastr.success('Thành công', 'Turtle Bay Resort', { timeOut: 5000 })

        });
    });

}

// Lấy dữ liệu trong storage
function getDataInit() {
    const inputBlackListUrl = document.querySelector(".BlackListUrl__content textarea");
    const inputBlackListWord = document.querySelector(".BlackListWord__content textarea");
    const inputAge = document.querySelector(".Option__content input");
    console.log([inputAge])
    // tab2
    chrome.storage.local.get(["ListURL"]).then((result) => {
        if (result["ListURL"] !== undefined) {
            inputBlackListUrl.value = result["ListURL"].join(';');
        } else {
            inputBlackListUrl.value = '';
        }
    });
    // tab3 
    chrome.storage.local.get(["ListWord"]).then(result => {
        if (result["ListWord"] !== undefined) {
            inputBlackListWord.value = result["ListWord"].join(';');
        } else {
            inputBlackListWord.value = '';
        }
    });

    // tab4 

    // tab1
    chrome.storage.local.get(["Age"]).then(result => {
        if (result["Age"] !== undefined) {
            inputAge.value = result["Age"];
        } else {
            // set tuổi mặc định 18
            inputAge.value = 18;
        }
    });
}