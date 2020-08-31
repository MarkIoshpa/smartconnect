import {rand} from "./components/Notification";
import {getModalStyle} from "./components/Notification";

test('rand is beetwen -10 to 10', () => {
    expect(rand()).toBeGreaterThan(-10);
    expect(rand()).toBeLessThan(10);
});
test('model style is beetwen 40 to 60', () => {
    const tmp =getModalStyle();
    expect(tmp.left).toBeGreaterThan(40);
    expect(tmp.left).toBeLessThan(60);
});