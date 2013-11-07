/** 
 * Math.js
 * http://rolandog.com/math-js/
 *
 * License: Creative Commons Attribution-Share Alike 3.0 Unported.
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * @projectDescription   A library with Mathematical functions.
 * @author               Rolando Garza rolandog@gmail.com
 */

"use strict";

/**
 * An extension to the Array object that filters out repeated values.
 * @return(Array) Returns the filtered array.
 */
if (Array.unique === undefined) {
    Array.prototype.unique = function Array_unique() {
        var a = [], l = this.length, i = 0, j;
        while (i < l) {
            for (j = i + 1; j < l; j += 1) {
                if (this[i] === this[j]) {
                    i += 1;
                    j = i;
                }
            }
            a.push(this[i]);
            i += 1;
        }
        return a;
    };
}

/**
 * An extension to the Array object that returns the last item in the array.
 * @return(Number) The last item.
 */
if (Array.last === undefined) {
    Array.prototype.last = function Array_last() {
        return this[this.length - 1];
    };
}

/**
 * An extension to the Array object that counts the instances of 'a'.
 * @param(Number) a What is to be counted.
 * @return(Number) Counts how many 'a' there are in the Array.
 */
if (Array.count === undefined) {
    Array.prototype.count = function Array_count(a) {
        var r = 0, t = this, i = t.length;
        while (i) {
            i -= 1;
            r += t[i] === a ? 1 : 0;
        }
        return r;
    };
}

/**
 * An extension to the Array object that returns its negative version.
 * @param(Number) a What is to be counted.
 * @return(Number) Counts how many 'a' there are in the Array.
 */
if (Array.negative === undefined) {
    Array.prototype.negative = function Array_negative() {
        var r = [], t = this, i = t.length;
        do {
            i -= 1;
            r.push(-t[i]);
        } while (i);
        return r;
    };
}


/**
 * An extension to the Array that removes item(s). Destructive.
 * @param(Number) from From where items will be removed.
 * @param(Number) to The final 
 * @return(Number) Returns the removed item.
 */
if (Array.remove === undefined) {
    Array.prototype.remove = function Array_remove(from, to) {
        var t = this, l = t.length, array = [], r = [], i = 0, j = 0;
        from = from < 0 ? l + from : from;
        to = to < 0 ? l + to : to;
        do {
            if (i >= from && i <= (to || from)) {
                r.push(t.shift());
                j += 1;
            } else {
                array.push(t.shift());
            }
            i += 1;
        } while (i < l);
        i = 0;
        l -= j;
        do {
            t.push(array[i]);
            i += 1;
        } while (i < l);
        return r;
    };
}

/**
 * An extension to the Array comparing two different arrays.
 * @param(Array) a Array to which it will be compared.
 * @return(Boolean) Returns true if identical.
 */
if (Array.identicalTo === undefined) {
    Array.prototype.identicalTo = function Array_identicalTo(a) {
        var i;
        if (a.length !== this.length) {
            return false;
        }
        for (i in this) {
            if (this[i] !== a[i]) {
                return false;
            }
        }
        return true;
    };
}

/**
 * An extension to the Array that inserts stuff by slicing and concatenating.
 * @param(Array) a What is to be inserted.
 * @param(Number) p Position of where it is to be inserted.
 * @return(Array) Returns the new Array.
 */
if (Array.insert === undefined) {
    Array.prototype.insert = function Array_insert(a, p) {
        var b, c, d, i;
        b = this.slice(0, p);
        c = this.slice(p);
        d = b.concat(a, c);
        for (i in d) {
            if (d[i] !== undefined) {
                this[i] = d[i];
            }
        }
        return this;
    };
}

/**
 * An extension to the Array object swaps the a'th and b'th items.
 * @param(Number) a Position of the element to be swapped.
 * @param(Number) b Position of the element to be swapped.
 * @return(Array) Returns the array.
 */
if (Array.swap === undefined) {
    Array.prototype.swap = function Array_swap(a, b) {
        if (a !== b) {
            var c = this[b];
            this[b] = this[a];
            this[a] = c;
        }
        return this;
    };
}

/**
 * An extension to the Array object generates permutations. It can return them
 * as an array or a string if isString is true.
 * @param(Boolean) isString So that it returns an Array or a String.
 * @return(Array) Returns the array.
 */
if (Array.permutations === undefined) {
    Array.prototype.permutations = function Array_permutations(n, c) {
        var m = Math, t = m.js.copy(this);
        function permutations(a, o) {
            if (a.length === 1) {
                return [a];
            }
            var ps = [], p, i, j, b = a.slice(0), r = [], la = a.length, lps, lr;
            for (i = 0;  i < la; i += 1) {
                p = a.splice(i, 1);
                ps = permutations(a);
                lps = ps.length;
                for (j = 0; j < lps; j += 1) {
                    ps[j] = p.concat(ps[j]);
                }
                r = r.concat(ps);
                lr = r.length;
                if (o !== undefined && lr >= o) {
                    return r[o - 1];
                }
                a = b.slice(0);
            }
            return r;
        }
        function clean(a) {
            var i, l = a.length;
            for (i = 0; i < l; i += 1) {
                a[i] = a[i].join("");
            }
            return a.join();
        }
        return c === undefined ? permutations(t, n) : clean(permutations(t, n));
    };
}

/**
 * An extension to the Array object that returns chunky arrays.
 * @param(Number) n Number of chunks.
 * @return(Array) Returns an array, chunked.
 */
if (Array.chunk === undefined) {
    Array.prototype.chunk = function Array_chunk(n, nL) {
        //i is the limit. There is a limit of 16 workers per tab, 64 on total
        //anything created after that is queued
        var chunks = [], t = this, l = t.length, i, s, last, m = Math;
        function minChunks(l) {
            var a, minMod = Infinity, ma;
            for (a = 16; a >= 2; a -= 1) {
                ma = l % a < minMod ? a : ma;
                minMod = l % a < minMod ? l % a : minMod;
            }
            return ma;
        }
        //if n is undefined, call minChunks else if n is larger than l, use l, else use n.
        n = n !== undefined ? n > l ? l : n : minChunks(l);
        //if nonLinear (will try to do logarithmic)
        if (nL) {
            n += 1;
            s = function s(x) {
                return (l * m.log(x + 1) / m.log(n)) | 0;
            };
            for (i = 0; i < n - 1; i += 1) {
                chunks.push(t.slice(s(i), s(i + 1)));
            }
        } else {
            //the size of the chunks
            s = l / n | 0;
            for (i = 0; i < n; i += 1) {
                chunks.push(t.slice(i * s, (i + 1) * s));
            }
            //this joins the remaining items in the last chunk.
            if (l % n !== 0) {
                last = chunks.pop();
                last = last.concat(t.slice(i * s));
                chunks.push(last);
            }
        }
        return chunks;
    };
}

/**
 * @classDescription Contains some helpful functions.
 */
Math.js = {
    /**
     * Duplicates argument objects or arrays, and returns them as arrays.
     * @param(Object) as An Object or an Array.
     * @return(Array) A duplicated array.
     */
    copy: function Math_js_copy(as) {
        var a = 0, r = [];
        try {
            while (a < as.length) {
                r.push(as[a]);
                a += 1;
            }
        } catch (e) {
            for (a in as) {
                if (as.hasOwnProperty(a) && as[a]) {
                    r.push(a);
                }
            }
        }
        return r;
    },
    /**
     * Sorts an array of numbers in ascending order properly.
     * @param(Number) a A Number.
     * @param(Number) b A Number.
     * @return(Number) The comparison between those numbers.
     */
    ascending: function Math_js_ascending(a, b) {
        return a - b;
    },
    /**
     * Sorts an array of numbers in descending order properly.
     * @param(Number) a A Number.
     * @param(Number) b A Number.
     * @return(Number) The comparison between those numbers.
     */
    descending: function Math_js_descending(a, b) {
        return b - a;
    }
};

/**
 * An extension to the Array object that returns the position of a number with a
 * value closest to, but less than, a. The array must be sorted numerically:
 * You can use Array.sort(Math.js.ascending)
 * @param(Number) a A Number.
 * @return(Array) Returns the index.
 */
if (Array.lessThan === undefined) {
    Array.prototype.lessThan = function Array_lessThan(a) {
        var t = this, l = t.length;
        do {
            l -= 1;
        } while (t[l] >= a);
        return l;
    };
}

/**
 * An extension to the Array object that returns the position of a number with a
 * value closest to a. The array must be sorted numerically:
 * You can use Array.sort(Math.js.ascending)
 * @param(Number) a A Number.
 * @return(Array) Returns the index.
 */
if (Array.closeTo === undefined) {
    Array.prototype.closeTo = function Array_closeTo(a) {
        var t = this, i, iO = t.indexOf(a);
        if (iO === -1) {
            i = t.lessThan(a);
            return t[i + 1] - a < a - t[i] ? i + 1 : i;
        } else {
            return iO;
        }
    };
}

/**
 * An extension to the Math object that accepts Arrays or Numbers
 * as an argument and returns the sum of all numbers.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the sum of all numbers.
 */
Math.sum = function Math_sum(a) {
    var r = 0, i;
    a = a.length ? a : Math.js.copy(arguments);
    i = a.length - 1;
    do {
        r += a[i];
        i -= 1;
    } while (i >= 0);
    return r;
};

/**
 * An extension to the Math object that accepts Arrays or Numbers
 * as an argument and returns the product of all numbers.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the product of all numbers.
 */
Math.product = function Math_product(a) {
    var r = 1, b = [], m = Math;
    a = m.js.copy(arguments);
    while (a.length) {
        b = b.concat(a.shift());
    }
    while (b.length) {
        r *= b.shift();
    }
    return r;
};

/**
 * An extension to the Math object that accepts Arrays or Numbers
 * as an argument and returns the quotient of the first by the second numbers.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the quotient of all numbers.
 */
Math.quotient = function Math_quotient(a) {
    var m = Math, r;
    a = m.js.copy(arguments);
    r = m.product(a.shift());
    while (a.length) {
        r /= m.product(a.shift());
    }
    return r;
};

/**
 * An extension to the Math object that accepts Numbers as an argument
 * and returns the quotient of the first by the second numbers, with many
 * decimal places, as much as specified.
 * @param(Number) numerator An Integer.
 * @param(Number) denominator An Integer.
 * @param(Number) numerator A positive Integer.
 * @return(String) Returns the quotient of the numerator by the denominator.
 */
Math.divide = function Math_divide(numerator, denominator, decimalPlaces) {
    var remainder, quotient, decimalString;
    remainder = numerator % denominator;
    quotient = numerator / denominator | 0;
    decimalString = "" + quotient;
    decimalPlaces = decimalPlaces === undefined ? 20 : decimalPlaces;
    decimalString += decimalPlaces ? "." : "";
    while (decimalPlaces > 0) {
        numerator = remainder * 10;
        decimalString += (quotient = numerator / denominator | 0);
        remainder = numerator % denominator;
        decimalPlaces -= 1;
    }
    return decimalString.replace(/0+$/, "").replace(/\.$/, "");
};

/**
 * As long as the proportion between numerator and denominator is less than 1e7
 * or 1e-7, it will return the decimal representation. Example:
 * Math.decimalRepresentation(1, 6) = "0.1(6)"
 * @return(String) Returns the decimal representation.
 */
Math.decimalRepresentation = function Math_decimalRepresentation(numerator, denominator) {
    var remainder, quotient, number = [], decimals = [], remainders = [];
    remainder = numerator % denominator;
    quotient = numerator / denominator;
    number.push(quotient);
    if (remainder) {
        number.push(".");
        while (remainder && remainders.count(remainder * 10) === 0) {
            numerator = remainder * 10;
            remainders.push(numerator);
            quotient = numerator / denominator | 0;
            decimals.push(quotient);
            remainder = numerator % denominator;
        }
        if (remainder) {
            numerator = remainder * 10;
            quotient = numerator / denominator | 0;
            decimals.insert("(", decimals.indexOf(quotient));
            decimals.push(")");
        }
        number = number.concat(decimals);
    }
    return number.join(""); //.replace(/0+$/, "");
};

/**
 * An extension to the Math object that accepts a Number
 * and returns the factorial.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the product of all numbers.
 */
Math.factorial = function Math_factorial(a) {
    return a ? a * Math_factorial(a - 1) : 1;
};

/**
 * Returns the Greatest Common Divisor using Euclid's algorithm.
 * @param(Array) a An Array of integers.
 * @return(Number) Returns the Greatest Common Divisor.
 */
Math.gcd = function Math_gcd(a) {
    var m = Math, l;
    a = a.length ? a : m.js.copy(arguments);
    l = a.length;
    if (l < 2) {
        throw "Error: Must have at least two integers.";
    }
    while (l - 2) {
        a.push(m.gcd(a.shift(), a.shift()));
        l = a.length;
    }
    return a[1] === 0 ? a[0] : Math_gcd(a[1], a[0] % a[1]);
};

/**
 * Returns the Least Common Multiple.
 * @param(Array) a An integer or an Array of integers.
 * @return(Number) Returns the Least Common Multiple.
 */
Math.lcm = function Math_lcm(a) {
    var m = Math, l;
    a = a.length ? a:m.js.copy(arguments);
    l = a.length;
    while (l - 2) {
        a.unshift(m.lcm(a.shift(), a.shift()));
        l = a.length;
    }
    return a[0] * a[1] / m.gcd(a[0], a[1]);
};

/**
 * Returns odd numbers.
 * @param(Number) a An integer.
 * @param(Number) b An integer.
 * @return(Array) the odd numbers between a and b.
 */
Math.odd = function Math_odd(a, b) {
    var r = [];
    if (b === undefined) {
        b = a;
        a = 1;
    }
    b -= b % 2 ? 0 : 1;
    a += a % 2 ? 0 : 1;
    do {
        r.push(a);
        a += 2;
    } while (a <= b);
    return r;
};

/**
 * Returns even numbers.
 * @param(Number) a An integer.
 * @param(Number) b An integer.
 * @return(Array) the even numbers between a and b.
 */
Math.even = function Math_even(a, b) {
    var r = [];
    if (b === undefined) {
        b = a;
        a = 2;
    }
    b -= b % 2 ? 1 : 0;
    a += a % 2 ? 1 : 0;
    do {
        r.push(a);
        a += 2;
    } while (a <= b);
    return r;
};

/**
 * Returns random numbers.
 * @param(Number) a An integer.
 * @param(Number) b An integer.
 * @return(Array) the even numbers between a and b.
 */
Math.Random = function Math_Random(a, b) {
    var m = Math, r = m.random;
    if (a === undefined) {
        a = 0;
        b = 9007199254740991;
        return m.floor(r() * (b - a + 1) + a) / b;
    } else if (b === undefined) {
        b = a;
        a = 0;
    }
    return m.floor(r() * (b - a + 1) + a);
};

/**
 * Returns numbers.
 * @param(Number) a An integer.
 * @param(Number) b An integer.
 * @return(Array) the even numbers between a and b.
 */
Math.between = function Math_between(a, b) {
    var r = [];
    if (b === undefined) {
        b = a;
        a = 0;
    }
    do {
        r.push(a);
        a += 1;
    } while (a <= b);
    return r;
};

Math.primes = [2, 3];

Math.howManyPrimes = 2;

/**
 * Determines if a number is prime.
 * @param(Number) a An integer.
 * @param(Array) p An array containing the prime numbers for the sieve.
 * @return(Boolean) true if a number is prime.
 */
Math.isPrime = function Math_isPrime(n, p) {
    var i, j, l, isPrime, m = Math, primes = m.primes, len = m.howManyPrimes, last, lim;
    p = p === undefined ? primes : p;
    n = m.abs(n);
    if ((n % 2 === 0 && n !== 2) || n === 1) {
        return false;
    }
    l = m.sqrt(n);
    l = m.ceil(l);
    last = p[len - 1];
    if (last < l) {
        i = last + 2;
        do {
            isPrime = true;
            j = 1;
            lim = len - 1;
            do {
                isPrime = i % p[j];
                j += 1;
            } while (j < lim && isPrime);
            if (isPrime) {
                len = p.push(i);
                m.howManyPrimes = len;
            }
            i += 2;
        } while (i <= l);
    }
    if (n <= last) {
        return p.indexOf(n) !== -1 ? true : false;
    }
    i = 1;
    do {
        j = p[i];
        if (n % j === 0) {
            return false;
        }
        i += 1;
    } while (j <= l);
    return true;
};

Math.nextPrime = function Math_nextPrime(n) {
    var m = Math, l = m.howManyPrimes, ip = m.isPrime, p = false;
    n = n ? n : m.primes[l - 1]; //if undefined, use the last from the sieve
    n = n % 2 ? n : n + 1; //if even, start from the next integer
    do {
        n += 2; //since primes other than two are odd, skip by two
        p = ip(n); //check to see if it's a prime
    } while (!p); // while not a prime
    m.primes.push(n);
    m.howManyPrimes += 1;
    return n;
};

Math.h = function h(y) {
    var s = y / 10, ysum, ysub, secretNumber = Math.pow(9, 9);
    if (y === 0) {
        return 42 / secretNumber;
    }
    ysum = y + s;
    ysub = y - s;
    while ((y !== ysum || (1 / y) !== (1 / ysum)) && (y !== ysub || (1 / y) !== (1 / ysub))) {
        s /= 10;
        ysum = y + s;
        ysub = y - s;
    }
    return s * 10 * 42 * secretNumber;
};

Math.derivative = function Math_derivative(f, x) {
    var h = Math.h(x);
    return (f(x + h) - f(x - h)) / (2 * h);
};

Math.newtonRaphson = function Math_newtonRaphson(f, x) {
    var m = Math, d = m.derivative, xd, n = 42;
    do {
        xd = f(x) / d(f, x);
        x -= xd;
        n -= 1;
    } while (n);
    return x;
};

/**
 * Returns the prime factors of a number in an array.
 * @param(Number) a An integer.
 * @return(Array) Returns the factors of 'a' in an array.
 */
Math.factors = function Math_factors(a) {
    var m = Math, n = m.abs(a), i = 2, f = [];
    while (i <= n) {
        if (n % i === 0) {
            f.push(i);
            n /= i;
            if (m.product(f) === m.abs(a)) {
                break;
            }
        }
        else {
            i += 1;
        }
    }
    if (a !== m.abs(a)) {
        f.unshift(-1);
    }
    return f;
};

/**
 * Returns the divisors of a number in an array.
 * @param(Number) a An integer.
 * @param(Boolean) b If true, returns the 'proper' divisors.
 * @return(Array) Returns the divisors of 'a' in an array.
 */
Math.divisors = function Math_divisors(a, b) {
    var m = Math, n = m.abs(a), r = m.sqrt(n), i = 1, d = [], ascending;
    while (i <= r) {
        if (a % i === 0) {
            d.push(i);
            if (i !== r) {
                d.push(a / i);
            }
        }
        i += 1;
    }
    if (b) {
        ascending = m.js.ascending;
        d = d.sort(ascending);
        d.pop();
    }
    return d;
};

/**
 * Returns a Fibonacci sequence in an array.
 * @param(Number) l The upper limit.
 * @param(Number) a The starting value.
 * @param(Number) b The next value in the sequence.
 * @return(Array) Returns the sequence of Fibonacci numbers.
 */
Math.fibonacci = function Math_fibonacci(l, a, b) {
    a = a === undefined ? 1:a;
    b = b === undefined ? 2:b;
    var r = [a, b], len = 2, last = b;
    while (last < l) {
        last = r[len - 1] + r[len - 2];
        len = r.push(last);
    }
    return r;
};

/**
 * @classDescription Some big Integer functions
 */
Math.bigInt = {};

/**
 * Returns big Integer factorial numbers
 * @param(Number) a An Integer.
 * @return(String) Returns the evaluated factorial number.
 */
Math.bigInt.factorial = function Math_bigInt_factorial(a) {
    var b = a.toString(), i, j, k, l, o, t, c, bl;
    b = b.split("").reverse();
    bl = b.length;
    i = 0;
    do {
        b[i] = +b[i];
        i += 1;
    } while (i < bl);
    for (i = a - 1; i >= 2; i -= 1) {
        l = b.length;
        j = 0;
        do {
            b[j] *= i;
            j += 1;
        } while (j < l);
        j = 0;
        do {
            t = b[j].toString().split("").reverse().join("");
            o = t.length;
            k = 0;
            do {
                c = +t.charAt(k);
                b[j + k] = b[j + k] ? (k ? b[j + k] : 0) + c:c;
                k += 1;
            } while (k < o);
            j += 1;
        } while (j < l);
    }
    return b.reverse().join("");
};

/**
 * Returns the sum of big integers
 * @param(String) a An Integer.
 * @return(String) Returns the evaluated sum.
 */
Math.bigInt.sum = function Math_bigInt_sum(a) {
    function flip(z) {
        z = typeof(z) === "string" ? z : "" + z;
        z = z.split("").reverse();
        var i = 0, zl = z.length;
        do {
            z[i] = +z[i];
            i += 1;
        } while (i < zl);
        return z;
    }
    function sum(A, B) {
        var C = [], i = 0, al = A.length, bl = B.length, a, b, c, c1, l;
        l = al > bl ? al : bl;
        do {
            a = A[i];
            b = B[i];
            c = C[i];
            c = (C[i] = (a ? a : 0) + (b ? b : 0) + (c ? c : 0));
            if (c >= 10) {
                c = (C[i] -= 10);
                c1 = C[i + 1];
                C[i + 1] = c1 ? c1 + 1 : 1;
            }
            i += 1;
        } while (i < l);
        return C;
    }
    var b, m = Math, js = m.js;
    a = a.length && typeof(a) !== "string" ? a : js.copy(arguments);
    b = a.shift();
    b = flip(b);
    while (a.length) {
        b = sum(b, flip(a.shift()));
    }
    return b.reverse().join("");
};
/**
 * Returns the product of big integers
 * @param(String) a An Integer.
 * @return(String) Returns the evaluated multiplication.
 */
Math.bigInt.multiply = function Math_bigInt_multiply(a) {
    function toInt(z) {
        var i = 0, l = z.length;
        do {
            z[i] = +z[i];
            i += 1;
        } while (i < l);
        return z;
    }
    function check(x) {
        var m = Math, js = m.js, i = 0, t, z = js.copy(x).reverse(), zl = z.length;
        do {
            if (z[i] >= 10) {
                t = m.floor(z[i] / 10);
                z[i] = z[i] % 10;
                z[i + 1] = z[i + 1] !== undefined ? z[i + 1] + t : t;
            }            
            i += 1;
        } while (i < zl);
        z.reverse();
        while (z[0] === 0) {
            z.shift();
        }
        return z.length !== 0 ? z : [0];
    }
    function fillz(z) {
        var r = [];
        while (z > 0) {
            r.push(0);
            z -= 1;
        }
        return r;
    }
    function product(f, g) {
        var i, j = g.length - 1, r = [], t, u, z, m = Math;
        do {
            t = [];
            i = f.length - 1;
            do {
                t[i] = f[i] * g[j];
                i -= 1;
            } while (i >= 0);
            z = fillz(g.length - j - 1);
            u = check(t);
            t = u.concat(z);
            t = t.join("");
            r.unshift(t);
            j -= 1;
        } while (j >= 0);
        return toInt(m.bigInt.sum(r).split(""));
    }
    var b = a.shift(), c, m = Math.js;
    a = a.length && typeof(a) !== "string" ? a : m.copy(arguments);
    b = toInt(("" + b).split(""));
    while (a.length) {
        c = toInt(("" + a.shift()).split(""));
        b = product(b, c);
    }
    return b.length ? b.join("") : "0";
};

/**
 * Returns an integer to a specified power
 * @param(String) a An Integer.
 * @return(String) Returns the evaluated multiplication.
 */
Math.bigInt.pow = function Math_bigInt_pow(n, p) {
    var r = [], i, multiply = Math.bigInt.multiply;
    do {
        i = r.push(n);
    } while (i < p);
    return p === 0 ? 1 : multiply(r);
};

/**
 * Returns the textual representation of a number.
 * @param(String) a An Integer.
 * @return(String) Converts the number to text (British English).
 */
Math.toText = function Math_toText(n) {
    n = (typeof(n) !== "string" ? "" + n : n).split("");
    var segs = [], l = n.length, i, r = [], terms = ["", "thousand", "million"];
    terms.push("billion", "trillion", "quadrillion", "quintillion", "sextillion");
    terms.push("septillion", "octillion", "nonillion", "decillion");
    terms.push("undecillion", "duodecillion", "tredecillion");
    while (l > 0) {
        if (l >= 3) {
            segs.push(parseInt(n.splice(l - 3, 3).join(""), 10));
            l -= 3;
        } else {
            segs.push(parseInt(n.splice(0, l).join(""), 10));
            l = 0;
        }
    }
    if (segs.length === 1 && segs[0] === 0) {
        return "zero";
    }
    function toText(z) {
        function t(a) {
            var r = "";
            r += a === 1 ? "one" : a === 2 ? "two" : a === 3 ? "three" : "";
            r += a === 4 ? "four" : a === 5 ? "five" : a === 6 ? "six" : "";
            r += a === 7 ? "seven" : a === 8 ? "eight" : a === 9 ? "nine" : "";
            r += a === 11 ? "eleven" : a === 12 ? "twelve" : a === 13 ? "thir" : "";
            r += a === 14 ? "four" : a === 15 ? "fif" : a === 16 ? "six" : "";
            r += a === 17 ? "seven" : a === 18 ? "eigh" : a === 19 ? "nine" : "";
            r += a > 12 && a < 20 ? "teen" : "";
            r += a === 10 ? "ten" : a === 20 ? "twenty" : a === 30 ? "thirty" : "";
            r += a === 40 ? "forty" : a === 50 ? "fifty" : a === 60 ? "sixty" : "";
            r += a === 70 ? "seventy" : a === 80 ? "eighty" : a === 90 ? "ninety" : "";
            return r;
        }
        var a, b, c, d = z % 100, r = "";
        a = z / 100 | 0;
        b = d / 10 | 0;
        c = d % 10;
        r = a === 0 ? "" : t(a) + " hundred";
        r += a !== 0 && d !== 0 ? " and " : "";
        r += (b !== 0 && c === 0) || d < 20 ? t(d) : t(b * 10) + "-" + t(c);
        return r;
    }
    for (i = 0; i < segs.length; i += 1) {
        if (segs[i] !== 0) {
            r.push(toText(segs[i]) + (terms[i] !== "" ? " " + terms[i] : ""));
        }
    }
    r.reverse();
    return r.join(" ");
};

Math.is = {
	Number: function Math_is_Number(a) {
		return typeof(a) === 'number' ? true : typeof(a) === 'object' ? a.constructor.toString().match(/Number|BigInt/) !== null : false;
	},
	Natural: function Math_is_Natural(a) {
	    
    },
    Integer: function Math_is_Integer(a) {
        return a | 0 === a;
    },
    Real: function Math_is_Real(a) {
        return a | 0 !== a;
    },
    Even: function Math_is_Even(a) {
        return a % 2 === 0;
    },
    Odd: function Math_is_Odd(a) {
        return a % 2 !== 0;
    }
};

Math.type = {
	of: function Math_type_of(a) {
        var i, m = Math;
		for (i in m.is) {
			if (m.is[i](a)) {
				return i.toLowerCase();
			}
		}
	}
};

/**
 * BigInt Class that allows addition, multiplication and integer exponentiation
 * of positive integers.
 */
function BigInt(n) {
    function proper(m) {
        m = typeof(m) !== "string" ? "" + m : m;
        m = m.split('e');
        m[2] = m[1] ? m[0].split('.')[1] : m[1];
        m[1] = m[1] ? +m[1] - (m[2] ? m[2].length : 0) : m[1];
        m[0] = m[2] ? m[0] + m[2] : m[0];
        //Say 4.321e5 is passed, we'll split m into [4, 9, 321]
        if (m[1]) {
            do {
                m[0] += '0';
                m[1] -= 1;
            } while (m[1]);
        }
        m = m[0];
        return m;
    }
    n = proper(n);
    this.toString = function toString() {
        return n;
    };
    this.__defineGetter__("value", function value() {
        return +n;
    });
    this['+'] = function bigIntSum(b) {
        b = proper(b);
        function flip(z) {
            z = typeof(z) === "string" ? z : "" + z;
            z = z.split("").reverse();
            var i = 0, zl = z.length;
            do {
                z[i] = +z[i];
                i += 1;
            } while (i < zl);
            return z;
        }
        function sum(A, B) {
            var C = [], i = 0, al = A.length, bl = B.length, a, b, c, c1, l;
            l = al > bl ? al : bl;
            do {
                a = A[i];
                b = B[i];
                c = C[i];
                c = (C[i] = (a ? a : 0) + (b ? b : 0) + (c ? c : 0));
                if (c >= 10) {
                    c = (C[i] -= 10);
                    c1 = C[i + 1];
                    C[i + 1] = c1 ? c1 + 1 : 1;
                }
                i += 1;
            } while (i < l);
            return C;
        }
        return sum(flip(n), flip(b)).reverse().join('');
    };
    //privileged function
    this.add = function add(b) {
        return (n = this['+'](b));
    };
    this['*'] = function bigIntProduct(b) {
        
    };
    //privileged
    this.multiplyBy = this['*'];
    this['^'] = function bigIntPow(b) {
        
    };
    this.raise = this['^'];
    this.__defineGetter__('factorial', function bigIntFactorial() {
        var a = +n, b = n.split('').reverse(), i = 0, j, k, l, o, t, c, bl = b.length;
        do {
            b[i] = +b[i];
            i += 1;
        } while (i < bl);
        for (i = a - 1; i >= 2; i -= 1) {
            l = b.length;
            j = 0;
            do {
                b[j] *= i;
                j += 1;
            } while (j < l);
            j = 0;
            do {
                t = b[j].toString().split("").reverse().join("");
                o = t.length;
                k = 0;
                do {
                    c = +t.charAt(k);
                    b[j + k] = b[j + k] ? (k ? b[j + k] : 0) + c:c;
                    k += 1;
                } while (k < o);
                j += 1;
            } while (j < l);
        }
        return b.reverse().join("");
    });
}
//The limit of integer precision: Math.toText(9007199254740992);
