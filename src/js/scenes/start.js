class StartScreen {
  update() {}

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, .8)'
    ctx.fillText('THE RETURN', 18, 26)
  }
}

export default StartScreen
