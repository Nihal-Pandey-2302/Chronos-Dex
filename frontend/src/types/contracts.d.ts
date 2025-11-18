declare module '*.json' {
  const value: any;
  export default value;
}

declare module './contracts/LiquidityPool.json' {
  const artifact: any;
  export default artifact;
}

declare module './contracts/GamificationVault.json' {
  const artifact: any;
  export default artifact;
}