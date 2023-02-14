var x = 1;
function func(
    x,
    y = function () {
        x = 2;
    }
) {
    x = 3;
    y();
    console.log(x); // => 2
}
func(5);
console.log(x); // => 1

// ---------------------------------------------

var x = 1;
function func(
    x,
    y = function () {
        x = 2;
    }
) {
    var x = 3;
    y();
    console.log(x); // => 3
}
func(5);
console.log(x); // => 1

// ---------------------------------------------

var x = 1;
function func(
    x,
    y = function () {
        x = 2;
    }
) {
    var x = 3;
    var y = function () {
        x = 4;
    };
    y();
    console.log(x); // => 4
}
func(5);
console.log(x); // => 1
