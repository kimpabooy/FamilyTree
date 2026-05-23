import './App.css'
import BasicFlow from './components/Flow/BasicFlow'
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
          <BasicFlow />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App