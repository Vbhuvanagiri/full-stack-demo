export default function NotFound() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='text-center'>
        <h1 className='mb-2 text-2xl font-semibold text-stone-800'>
          Page not found
        </h1>
        <p className='text-stone-600'>
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
