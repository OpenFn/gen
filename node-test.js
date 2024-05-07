process.stdout.on("data", (m) => {
  console.error("jam");
});

process.stdout.write = (m) => {
  console.error("intercept", m);
};

console.log("hello world 1");
console.log("hello world 2");
