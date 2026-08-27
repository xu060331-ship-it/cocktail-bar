import { Component } from "react"

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)] px-6 text-center text-[var(--color-text-main)]">
        <section className="w-full max-w-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
          <p className="mb-2 font-ui text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">页面暂时出错</p>
          <h1 className="mb-3 text-2xl">这页没有正常完成加载</h1>
          <p className="mb-6 text-sm leading-6 text-[var(--color-text-muted)]">你的数据不会因此丢失。刷新页面通常可以恢复，如果问题持续，请把控制台错误发给我。</p>
          <button type="button" onClick={this.handleReload} className="bg-[var(--color-accent)] px-5 py-2.5 font-ui text-sm font-semibold text-[var(--color-bg-page)]">刷新页面</button>
        </section>
      </main>
    )
  }
}
