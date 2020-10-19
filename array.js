const Memory = require('./Memory');

/*
1. Implement an Array class from scratch.
Walk through each step of implementing an array. Don't rush through this by copying and pasting the code samples. After you've walked through it and you understand the code of the Array class, hide the sample code and try writing the Array class from scratch using the Memory module here for allocating Memory.

Be sure to export the Memory module and then import it using require.
*/

const memory = new Memory();

class Array {
	constructor() {
		this.length = 0;
		this._capacity = 0;
		this.ptr = memory.allocate(this.length);
	}

	push(value) {
		if (this.length >= this._capacity) {
			this._resize((this.length + 1) * Array.SIZE_RATIO);
		}

		memory.set(this.ptr + this.length, value);
		this.length++;
	}

	pop() {
		if (this.length == 0) {
			throw new Error('Index error');
		}
		const value = memory.get(this.ptr + this.length - 1);
		this.length--;
		return value;
	}

	_resize(size) {
		const oldPtr = this.ptr;
		this.ptr = memory.allocate(size);
		if (this.ptr === null) {
			throw new Error('Out of Memory');
		}
		memory.copy(this.ptr, oldPtr, this.length);
		memory.free(oldPtr);
		this._capacity = size;
	}

	get(index) {
		if (index < 0 || index >= this.length) {
			throw new Error('Index error');
		}
		return memory.get(this.ptr + index);
	}

	insert(index, value) {
		if (index < 0 || index >= this.length) {
			throw new Error('Index error');
		}

		if (this.length >= this._capacity) {
			this._resize((this.length + 1) * Array.SIZE_RATIO);
		}

		memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
		memory.set(this.ptr + index, value);
		this.length++;
	}

	remove(index) {
		if (index < 0 || index >= this.length) {
			throw new Error('Index error');
		}
		memory.copy(
			this.ptr + index,
			this.ptr + index + 1,
			this.length - index - 1
		);
		this.length--;
	}
}

/*
2. Explore the push() method
Using the Array class you just created above, add an item to the array. Use the following function:
*/

function main() {
	Array.SIZE_RATIO = 3;

	// Create an instance of the Array class
	let arr = new Array();

	// Add an item to the array
	arr.push(3);
	arr.push(5);
	arr.push(15);
	arr.push(19);
	arr.push(45);
	arr.push(10);
	arr.pop();
	arr.pop();
	arr.pop();
	arr.pop();
	arr.pop();
	arr.pop();
	arr.push('tauhida');

	console.log(arr.get(0));
}

main();

/*
What is the length, capacity and Memory address of your array?
length: 1, _capacity: 3, ptr: 0

Add the following in the main function and then print the array:

    ...
    arr.push(5);
    arr.push(15);
    arr.push(19);
    arr.push(45);
    arr.push(10);
What is the length, capacity and Memory address of your array? Explain the result of your program after adding the new lines of code.
length: 6, _capacity: 12, ptr: 3
The length is because I added a total of 6 items to the array. After the third item the array is resized with the size ratio of 3 * the length, which is 3, plus one making the new array 12 indexes. The ptr is set to the length of the original array.

3. Exploring the pop() method
Add the following in the main function and then print the array:

  ...
  arr.pop();
  arr.pop();
  arr.pop();
What is the length, capacity, and address of your array? Explain the result of your program after adding the new lines of code.
length: 3, _capacity: 12, ptr: 3
Three items are removed from the array making the length 3

4. Understanding more about how arrays work
Print the 1st item in the array arr.
3

Empty the array and add just 1 item: arr.push("tauhida");
length: 1, _capacity: 12, ptr: 3

Print this 1 item that you just added. What is the result? Can you explain your result?
NaN
The ptr is on memory slot 3 but it is empty

What is the purpose of the _resize() function in your Array class?
To create a new Array with more memory allocated to it to copy the old array into.

You can use JavaScript's built-in arrays to solve the following drills. After you write the algorithm, identify its time complexity and determine if it needs to be optimized. Start each problem by understanding the problem and coming up with some sample input and output. For your convenience, a few sample input and output are provided.
5. URLify a string
A common mistake users make when they type in an URL is to put spaces between words or letters. A solution that developers can use to solve this problem is to replace any spaces with a %20. Write a method that takes in a string and replaces all its empty spaces with a %20. Your algorithm can only make 1 pass through the string. Examples of input and output for this problem can be

Input: tauhida parveen

Output: tauhida%20parveen

Input: www.thinkful.com /tauh ida parv een

Output: www.thinkful.com%20/tauh%20ida%20parv%20een
O(n) because you have to check the whole string for the ' '
*/
function URLify(string) {
	let array = string.split(' ');
	const url = array.join('%20');
	console.log(url);
}

URLify('tauhida parveen');
URLify('www.thinkful.com /tauh ida parv een');
/*

6. Filtering an array
Imagine you have an array of numbers. Write an algorithm to remove all numbers less than 5 from the array. DO NOT use Array's built-in .filter() method here; write the algorithm from scratch.

function lessThan5 (array) {
	const result = []
	for(let number of array){
		if(number < 5){
			result.push(number)
		}
	}
	return result
}

7. Max sum in the array
You are given an array containing positive and negative integers. Write an algorithm which will find the largest sum in a continuous sequence.
*/

function findLargestSum(array) {
	let sum = 0;
	for (let i = 0; i < array.length - 1; i++) {
		sum += array[i] + array[i + 1];
	}
	console.log(sum);
}

findLargestSum([4, 6, -3, 5, -2, 1]);
/*
Input: [4, 6, -3, 5, -2, 1]
Output: 12
8. Merge arrays
Imagine you have 2 arrays which have already been sorted. Write an algorithm to merge the 2 arrays into a single array, which should also be sorted.

Input:[1, 3, 6, 8, 11] and [2, 3, 5, 8, 9, 10]
Output:[1, 2, 3, 3, 5, 6, 8, 8, 9, 10, 11]
*/
function merge(arr1, arr2) {
	arr1ptr = 0;
	arr2ptr = 0;

	const result = [];
	let i = 0;

	while (arr1ptr < arr1.length && arr2ptr < arr2.length) {
		if (arr1[i] > arr2[i]) {
			result.push(arr2[i]);
			arr2ptr++;
			if (arr2[i + 1] < arr1[i]) {
				result.push(arr2[i + 1]);
				arr2ptr++;
			}
			result.push(arr1[i]);
			arr1ptr++;
			i++;
		} else {
			result.push(arr1[i]);
			arr1ptr++;
			if (arr1[i + 1] < arr2[i]) {
				result.push(arr1[i + 1]);
				arr1ptr++;
			}
			result.push(arr2[i]);
			arr2ptr++;
			i++;
		}
	}

	if (arr1.length > arr1ptr || arr2.length > arr2ptr) {
		if (arr1.length > arr2.length) {
			for (let j = arr2.length; j < arr1.length; j++) {
				if (arr1[j] === result[result.length - 1]) {
					if (arr1[j + 1]) {
						result.push(arr1[j + 1]);
					}
				} else {
					result.push(arr1[j]);
				}
			}
		} else {
			for (let j = arr1.length; j < arr2.length; j++) {
				if (arr2[j] === result[result.length - 1]) {
					if (arr2[j + 1]) {
						result.push(arr2[j + 1]);
					}
				} else {
					result.push(arr2[j]);
				}
			}
		}
	}
	console.log(result);
}

merge([1, 3, 6, 8, 11], [2, 3, 5, 8, 9, 10]);
/*
9. Remove characters
Write an algorithm that deletes given characters from a string. For example, given a string of "Battle of the Vowels: Hawaii vs. Grozny" and the characters to be removed are "aeiou", the algorithm should transform the original string to "Bttl f th Vwls: Hw vs. Grzny". Do not use Javascript's filter, split, or join methods.

Input:'Battle of the Vowels: Hawaii vs. Grozny', 'aeiou'
Output: 'Bttl f th Vwls: Hw vs. Grzny'
*/

function removeVowels(string) {
	result = '';
	for (let i = 0; i < string.length; i++) {
		if (
			string[i] === 'a' ||
			string[i] === 'e' ||
			string[i] === 'i' ||
			string[i] === 'o' ||
			string[i] === 'u'
		) {
		} else {
			result += string[i];
		}
	}
	console.log(result);
}

removeVowels('Battle of the Vowels: Hawaii vs. Grozny');
/*
10. Products
Given an array of numbers, write an algorithm that outputs an array where each index is the product of all the numbers in the input array except for the number at each current index. See the following example input and output.

Input:[1, 3, 9, 4]
Output:[108, 36, 12, 27]
*/
function products(array) {
	let ptr = 0;
	const result = [];
	let product = 1;
	while (ptr < array.length) {
		for (let i = 0; i < array.length; i++) {
			if (i !== ptr) {
				product = product * array[i];
			}
		}
		result.push(product);
		product = 1;
		ptr++;
	}
	console.log(result);
}
products([1, 3, 9, 4]);
/*
11. 2D array
Write an algorithm which searches through a 2D array, and whenever it finds a 0 should set the entire row and column to 0.

Input:
[[1,0,1,1,0],
[0,1,1,1,0],
[1,1,1,1,1],
[1,0,1,1,1],
[1,1,1,1,1]];
Output:
[[0,0,0,0,0],
[0,0,0,0,0],
[0,0,1,1,0],
[0,0,0,0,0],
[0,0,1,1,0]];
*/

/*
12. String rotation
Given 2 strings, str1 and str2, write a program that checks if str2 is a rotation of str1.

Input: amazon, azonma

Output: False

Input: amazon, azonam

Output: true
*/
