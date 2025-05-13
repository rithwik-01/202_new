              <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                {restaurant.name}
              </h3>
              <p className="text-gray-600 mb-4">{restaurant.cuisine?.name || restaurant.cuisine}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-700">{restaurant.rating || 'New'}</span>
                </div>
                <span className="text-gray-600">{formatCost(restaurant.cost_rating)}</span>
              </div>
            </div> 