import { downloadData } from "./ipfs";

async function main() {
  const data = await downloadData(
    "QmbGqByBEqW8yZiBX1dYLvLHezv18vmonMyns5SuxKidZ8"
  );

  console.log("data", data);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
