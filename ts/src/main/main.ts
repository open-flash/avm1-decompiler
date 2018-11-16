async function main(): Promise<void> {
  throw new Error("NotImplemented");
}

main()
  .catch((err: Error): never => {
    console.error(err.stack);
    process.exit(1);
    return undefined as never;
  });
