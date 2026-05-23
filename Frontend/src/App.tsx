import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import SidePanel from './components/sidepanel'

function App() {
  return (
    <>
      <div className="app">
        <Header />
        <SidePanel />
        <main className="main-content">
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App