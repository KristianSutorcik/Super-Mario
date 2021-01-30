var level1 = [
    ["name", 1],
    ["length", 200],

    ["pipe", 20, 16],
    ["enemy", 50],
    ["pipe", 100, 36],
    ["pipe", 120, 16],
    ["bonus", 150, 30],
    ["platform", 30, 35, 48]
];

var level2 = [
    ["name", 2],
    ["length", 320],

    ["pipe", 20, 16],
    ["pipe", 100, 36],
    ["pipe", 120, 16],
    ["pipe", 180, 16],
    ["pipe", 250, 16],
    ["bonus", 150, 30],
    ["bonus", 150, 60],
    ["enemy", 50],
    ["enemy", 140],
    ["platform", 30, 35, 48]
];

var level3 = [
    ["name", 3],
    ["length", 480],

    ["pipe", 20, 16],
    ["pipe", 30, 36],
    ["bonus", 56, 20],
    ["pipe", 90, 36],
    ["pipe", 100, 16],
    ["enemy", 150],
    ["platform", 120, 40, 68],
    ["bonus", 120, 30],
    ["bonus", 150, 30],
    ["bonus", 180, 30],
    ["pipe", 250, 16],
    ["bonus", 260, 20],
    ["bonus", 280, 30],
    ["bonus", 300, 40],
    ["bonus", 320, 50],
    ["enemy", 320],
    ["pipe", 350, 16],
    ["enemy", 360],
    ["pipe", 400, 16],
];

level1.push(["next", level2]);
level2.push(["next", level3]);
level3.push(["next", level1]);