import  "bootstrap/dist/css/bootstrap.min.css"
import './css/style.css'
import { Inter } from 'next/font/google'
import { ENV } from 'shared/constants/env';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GreenerChain Bridge',
  description: 'GreenerChain Bridge',
}

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="The wonderful GreenerChain team" />
      </head>
      <body className={inter.className}>
        <div style={{ textAlign: 'center', margin: '25px' }}>
          <img
            fetchpriority="high"
            width={2581}
            height={556}
            src="https://www.greenercoin.io/wp-content/uploads/2023/01/Greenercoin-horizontal_light.png"
            alt="GreenerCoin I The first native token of GreenerChain, the certified green blockchain"
            style={{ maxWidth: '200px', height: '47px', textAlign: 'center' }}
          />
        </div>
        <div className="container-fluid">
          <div className="row">
          <div id="dev" className="dev_show">
            <p className="Environment">
            Environment: <span className="contract_balance">{ENV}</span>
            </p>
          </div>
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <br /><br />
              {children}
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </body>
    </html>
  )
}
