struct FlowGraph {
  source_block: Block,
  blocks: Vec<Block>,
}

/**
 * This block corresponds to the end of the script.
 */
struct TerminalBlock {}

/**
 * This basic block leads to an other basic block.
 */
struct JumpBlock {}

/**
 * There are two possible next basick blocks. The destination is chosen
 * depending on a test operand.
 */
struct ConditionalJumpBlock {}

/**
 * This basic returns a value from the current function.
 */
struct ReturnBlock {}

struct TryBlock {}

struct WithBlock {}

enum Block {
  ConditionalJumpBlock,
  JumpBlock,
  TerminalBlock,
  TryBlock,
  WithBlock,
}
