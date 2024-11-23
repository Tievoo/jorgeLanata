function toRoman(number) {
    let res = '';
    const roman = [
        ['I', 'V'],
        ['X', 'L'],
        ['C', 'D'],
        ['M', '']
    ];
    let i = 0;
    while (number > 0) {
        let digit = number % 10;
        number = Math.floor(number / 10);
        console.log(digit, number, res)
        if (digit === 0) {
            i++;
            continue;
        }
        if (digit <= 3) {
            res = roman[i][0].repeat(digit) + res;
        } else if (digit === 4) {
            res = roman[i][0] + roman[i][1] + res;
        } else if (digit === 5) {
            res = roman[i][1] + res
        }
        else if (digit <= 8) {
            res = roman[i][1] + roman[i][0].repeat(digit - 5) + res;
        } else {
            res = roman[i][0] + roman[i + 1][0] + res;
        }
        i++;
    }
    return res;
}

console.log(toRoman(10))
