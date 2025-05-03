import { Rating } from './Rating'

export const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <Rating />
          <p className="mt-4 text-center text-gray-500">
            © {new Date().getFullYear()} Study Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}