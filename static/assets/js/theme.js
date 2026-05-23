if (localStorage.getItem("theme") == "dark") {
    document.documentElement.dataset.theme = "dark";
} else if (!localStorage.getItem("theme")) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.dataset.theme = "dark";
        localStorage.setItem("theme", "dark")
    }
    else {
        localStorage.setItem("theme", "light")
    }
}