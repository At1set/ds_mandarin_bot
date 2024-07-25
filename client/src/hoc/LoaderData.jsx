import React, { Suspense } from "react"
import { Await } from "react-router-dom"

const LoaderData = ({resolve, fallback, children}) => {
  return (
    <Suspense fallback={fallback}>
      <Await resolve={resolve}>
        {children}
      </Await>
    </Suspense>
  )
}

export default LoaderData