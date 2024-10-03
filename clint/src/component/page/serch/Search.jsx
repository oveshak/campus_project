import React, { useState } from 'react';
import productData from '../../../data/movie.json';
import ProductCard from '../../sheard/moviecard/MovieCard';
import { Helmet } from 'react-helmet-async';

const Search = () => {
    // State for search query and filtered products
    const [searchQuary, setSearchQuary] = useState('');
    const [filterproduct, setFilterProduct] = useState(productData); // Initialize with all products

    // Function to handle search
    const handelSearch = () => {
        const filtered = productData.filter(product => 
            product.title.toLowerCase().includes(searchQuary.toLowerCase()) || 
            product.synopsis.toLowerCase().includes(searchQuary.toLowerCase()) || 
            product.category.toLowerCase().includes(searchQuary.toLowerCase())
        );
        setFilterProduct(filtered); // Set filtered products to state
    };

    return (
        <>
        <Helmet>
            <title>Movie | SearchPage</title>
            </Helmet>
            <div className="hero bg-base-200 h-[480px] ">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Search Page</h1>
      <p className="py-6">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
      
    </div>
  </div>
</div>

<section className="py-10 ">
    <div className="container mx-auto px-6">
        {/* Search Input and Button */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start mb-8 space-y-4 md:space-y-0 md:space-x-4">
            <input 
                type="text" 
                placeholder="Search for a movie..." 
                value={searchQuary} 
                onChange={(e) => setSearchQuary(e.target.value)}  
                className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            />
            <button 
                onClick={handelSearch} 
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
            >
                Search
            </button>
        </div>

        {/* Display filtered products or a message */}
        {filterproduct && filterproduct.length > 0 ? (
            <div className="">
                <ProductCard movies={filterproduct} />
            </div>
        ) : (
            <p className="text-center text-gray-600 text-lg mt-8">No movies found. Please try a different search.</p>
        )}
    </div>
</section>

        </>
    );
};

export default Search;
