
const isIncludeDotOnHTMLElement = (el, dotX, dotY) => {
    const {
        x,
        y,
        height,
        width,
    } = el.getBoundingClientRect();

    return (
        (dotX >= x) &&
        (dotX <= (x + width)) &&
        (dotY >= y) &&
        (dotY <= (y + height))
    );
};

export {isIncludeDotOnHTMLElement};