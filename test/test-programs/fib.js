// print the first 10 numbers in
// the fibonaci sequence
var count = 0;
var prev = 0;
var curr = 1;

function fib() {
	var next = prev + curr;
	console.log(next);
	prev = curr;
	curr = next;
}

console.log(prev);
console.log(curr)

while(++count < 8) {
	fib();
}