let clock = undefined;


function getCenter(htmlElem) {
    let rect = htmlElem.getBoundingClientRect()
    return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
    }
}


class Clock {
    constructor(clockElem) {
        this.body = clockElem.querySelector(".clock-body");
        Object.defineProperty(this, "center", {
            get: () => getCenter(this.body)
        })

        this.radius = (this.center.x - this.body.clientLeft);

        // init digits
        let digitNums = Array.from(Array(12), (x, i) => i + 1);
        this.digits = digitNums.map((n, i) => {
            let elem = document.createElement("div")
            elem.classList.add("clock-digit");
            elem.innerText = "" + n;

            this.body.appendChild(elem);
            return elem;
        });

        this.placeHands();
        this.placeDigits();

        window.setInterval(() => {
            let time = new Date(Date.now());
            let hours = time.getHours();
            let minutes = time.getMinutes();
            let seconds = time.getSeconds();
            this.drawHands(hours, minutes, seconds);
        }, 50);
    }

    moveToCenter(elem) {
        let elemRect = elem.getBoundingClientRect();
        let elemCenter = getCenter(elem);
        let newPos = {
            x: this.center.x - (elemCenter.x),
            y: this.center.y - (elemCenter.y)
        }
        elem.style.left = `${newPos.x}px`;
        elem.style.top = `${newPos.y}px`;
    }

    placeDigits() {
        this.digits.map((elem, i) => {
            let n = i + 1;

            // place digit
            this.moveToCenter(elem);
            let elemRect = elem.getBoundingClientRect();
            let elemCenter = getCenter(elem);
            let radius = this.body.getBoundingClientRect().width / 2 * 0.775; // ASSP aspect ratio = 1
            let digitPos = {
                x: (Math.sin((2 * Math.PI) * (n / 12)) * radius),
                y: (Math.cos((2 * Math.PI) * (n / 12) + Math.PI) * radius)
            }

            let newPos = {
                x: (this.center.x - this.body.getBoundingClientRect().x) - elemRect.width / 2 + digitPos.x,
                y: (this.center.y - this.body.getBoundingClientRect().y) - elemRect.height / 2 + digitPos.y,
            }

            elem.style.left = `${newPos.x}px`;
            elem.style.top = `${newPos.y}px`;
        });
    }

    placeHands() {
        // init hands
        this.hands = {};
        ["hour", "minute", "second"].map((name) => {
            let hand = document.createElement("div");
            hand.classList.add("clock-hand");
            hand.classList.add(`clock-hand-${name}`);

            let handAnchor = document.createElement("div");
            handAnchor.classList.add("clock-hand-anchor");
            handAnchor.classList.add(`clock-hand-anchor-${name}`);
            handAnchor.appendChild(hand);

            this.body.appendChild(handAnchor);
            this.hands[name] = handAnchor;

            this.moveToCenter(handAnchor);

            hand.style.bottom = -10;
            hand.style.left = getCenter(handAnchor).x - getCenter(hand).x;
        });
    }
    
    drawHands(hour, minute, second) {
        let sAngle = (second / 60) * (2 * Math.PI);
        this.hands.second.style.transform = `rotate(${sAngle}rad)`;

        let mAngle = (minute / 60) * (2 * Math.PI) + (sAngle / 60);
        this.hands.minute.style.transform = `rotate(${mAngle}rad)`;

        let hAngle = (hour / 12) * (2 * Math.PI) + (mAngle / 60);
        this.hands.hour.style.transform = `rotate(${hAngle}rad)`;
    }
}


function initClock() {
    clockElem = document.querySelector(".clock");
    clock = new Clock(clockElem);
}


window.addEventListener("load", initClock);