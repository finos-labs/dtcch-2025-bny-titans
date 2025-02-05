#include <bits/stdc++.h>
using namespace std;

#define int long long
using ii = pair<int, int>;

int n, q;
vector<int> g[200200];
int arr[200200];
int tin[200200];
int subteesz[200200];
int flatten[200200];
int timer = 0;

vector<unordered_set<int>> t(4 * 200200);

void build(int index, int l, int r) {
    if (l == r) {
        t[index].insert(flatten[l]);
        return;
    }

    int mid = (l + r) / 2;
    build(2 * index, l, mid);
    build(2 * index + 1, mid + 1, r);

    t[index].insert(t[2 * index].begin(), t[2 * index].end());
    t[index].insert(t[2 * index + 1].begin(), t[2 * index + 1].end());
}

void update(int index, int l, int r, int pos, int val) {
    if (pos < l || pos > r) return;

    if (l == r) {
        t[index] = {val}; // Replace set instead of modifying it
        return;
    }

    int mid = (l + r) / 2;
    update(2 * index, l, mid, pos, val);
    update(2 * index + 1, mid + 1, r, pos, val);

    t[index].clear();
    t[index].insert(t[2 * index].begin(), t[2 * index].end());
    t[index].insert(t[2 * index + 1].begin(), t[2 * index + 1].end());
}

unordered_set<int> query(int index, int l, int r, int lq, int rq) {
    if (rq < l || lq > r) return {};  // Return empty unordered_set directly

    if (lq <= l && r <= rq) return t[index];

    int mid = (l + r) / 2;
    unordered_set<int> left = query(2 * index, l, mid, lq, rq);
    unordered_set<int> right = query(2 * index + 1, mid + 1, r, lq, rq);

    left.insert(right.begin(), right.end());  // Merge results inline
    return left;
}

void dfs(int node, int parent) {
    tin[node] = ++timer;
    subteesz[node] = 1;

    for (auto v : g[node]) {
        if (v != parent) {
            dfs(v, node);
            subteesz[node] += subteesz[v];
        }
    }
}

void solve() {
    cin >> n;

    for (int i = 1; i <= n; i++) {
        cin >> arr[i];
    }

    for (int i = 1; i < n; i++) {
        int x, y;
        cin >> x >> y;
        g[x].push_back(y);
        g[y].push_back(x);
    }

    dfs(1, 0);

    for (int i = 1; i <= n; i++)
        flatten[tin[i]] = arr[i];

    build(1, 1, n);

    for (int i = 1; i <= n; i++)
        cout << query(1, 1, n, tin[i], tin[i] + subteesz[i] - 1).size() << ' ';
}

signed main() {
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);

    solve();
}
