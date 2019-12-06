#include <stdio.h>

void criteria(int num, int *f1, int *f2){
    int a = num % 10;
    num /= 10;

    int b = num %10;
    num /= 10;

    if(a < b) return;

    int c = num %10;
    num /= 10;

    if(b < c) return;

    int d = num %10;
    num /= 10;

    if(c < d) return;

    int e = num %10;
    num /= 10;

    if(d < e) return;

    int f = num %10;
    num /= 10;

    if(e < f) return;

    (*f1) += a == b || b == c || c == d || d == e || e == f;

    (*f2) += (a == b && b != c) ||
        (b == c && b != a && c != d) ||
        (c == d && c != b && d != e) ||
        (d == e && d != c && e != f) ||
        (e == f && e != d);
}

int main(void){
    int range[2] = {367479, 893698};
    int found1 = 0;
    int found2 = 0;

#pragma omp parallel for num_threads(4) reduction(+:found1, found2)
    for(int i = range[0]; i < range[1]; i++){
        criteria(i, &found1, &found2);
    }
    printf("part1: %d\npart2: %d\n", found1, found2);
}
