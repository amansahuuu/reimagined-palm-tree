import React, { useState, useEffect } from 'react';
import { Calendar, Dumbbell, ShoppingCart, TrendingUp, Flame, Droplet, Award, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { loadUserData, saveUserData, loadTodayData, saveTodayData } from './firebase';

// ==================== DATA STRUCTURES ====================

const EXERCISES = {
  push: [
    { name: "Incline Push-ups", xpPerRound: 15, type: "time", duration: 45 },
    { name: "Pike Push-ups", xpPerRound: 12, type: "time", duration: 45 },
    { name: "Bench Dips", xpPerRound: 10, type: "time", duration: 45 },
    { name: "Plank to Downward Dog", xpPerRound: 8, type: "time", duration: 45 }
  ],
  pull: [
    { name: "Australian Pull-ups", xpPerRound: 18, type: "time", duration: 45 },
    { name: "Arch Holds", xpPerRound: 10, type: "time", duration: 45 },
    { name: "Bodyweight Squats", xpPerRound: 12, type: "time", duration: 45 },
    { name: "Knee Tucks", xpPerRound: 8, type: "time", duration: 45 }
  ],
  legs: [
    { name: "Bodyweight Squats", xpPerRound: 15, type: "time", duration: 45 },
    { name: "Reverse Lunges", xpPerRound: 14, type: "time", duration: 45 },
    { name: "Glute Bridges", xpPerRound: 10, type: "time", duration: 45 },
    { name: "Plank", xpPerRound: 12, type: "time", duration: 45 },
    { name: "Leg Raises", xpPerRound: 11, type: "time", duration: 45 }
  ]
};

const INDIAN_FOODS = [
  { name: "Egg Curry (2 eggs)", calories: 320, protein: 18, carbs: 8, fat: 24, bowlSize: "medium" },
  { name: "Aloo Paratha", calories: 280, protein: 7, carbs: 45, fat: 9, unit: "piece" },
  { name: "Dal", calories: 120, protein: 8, carbs: 20, fat: 2, bowlSize: "half" },
  { name: "Chawal (200gm)", calories: 260, protein: 5, carbs: 58, fat: 1, unit: "serving" },
  { name: "Mixed Sabji", calories: 150, protein: 4, carbs: 12, fat: 8, bowlSize: "medium" },
  { name: "Aloo Soya Sabji", calories: 220, protein: 12, carbs: 20, fat: 10, bowlSize: "medium" },
  { name: "Bengali Chana Sabji", calories: 180, protein: 9, carbs: 25, fat: 5, bowlSize: "medium" },
  { name: "Sattu Paratha", calories: 190, protein: 11, carbs: 30, fat: 5, unit: "piece" },
  { name: "Mix Veg", calories: 140, protein: 4, carbs: 15, fat: 6, bowlSize: "medium" },
  { name: "Poha", calories: 250, protein: 6, carbs: 45, fat: 7, bowlSize: "medium" },
  { name: "Popcorn", calories: 60, protein: 2, carbs: 12, fat: 1, bowlSize: "small" },
  { name: "Chola Bhature", calories: 420, protein: 15, carbs: 65, fat: 12, unit: "serving" },
  { name: "Dal Makhani", calories: 320, protein: 12, carbs: 25, fat: 18, bowlSize: "medium" },
  { name: "Roti", calories: 80, protein: 3, carbs: 15, fat: 1.5, unit: "piece" }
];

const JUNK_FOODS2 = [
  { name: "Lays Chips (pack)", xp: 160, calories: 200, type: "chips" },
  { name: "Kurkure (pack)", xp: 176, calories: 220, type: "chips" },
  { name: "Maggi", xp: 320, calories: 400, type: "instant" },
  { name: "Dairy Milk", xp: 224, calories: 280, type: "chocolate" },
  { name: "Coca Cola (250ml)", xp: 84, calories: 105, type: "drink" },
  { name: "Pepsi (250ml)", xp: 84, calories: 105, type: "drink" },
  { name: "Oreo (1 cookie)", xp: 20, calories: 25, type: "biscuit" },
  { name: "Parle-G (1 biscuit)", xp: 12, calories: 15, type: "biscuit" },
  { name: "Chola Bhature", xp: 336, calories: 420, type: "street_food" },
  { name: "KitKat (2 fingers)", xp: 48, calories: 60, type: "chocolate" },
  { name: "Haldiram's Bhujia (pack)", xp: 144, calories: 180, type: "namkeen" },
  { name: "Ice Cream (1 scoop)", xp: 96, calories: 120, type: "dessert" }
];

const DAILY_HABITS = [
  { id: 'skincare_morning', name: 'Morning Skincare', xp: 10 },
  { id: 'skincare_night', name: 'Night Skincare', xp: 10 },
  { id: 'hygiene_shower', name: 'Shower', xp: 5 },
  { id: 'hygiene_teeth_morning', name: 'Brush Teeth (Morning)', xp: 5 },
  { id: 'hygiene_teeth_night', name: 'Brush Teeth (Night)', xp: 5 },
  { id: 'water_3l', name: 'Drink 3L Water', xp: 20 }
];

// ==================== MAIN APP ====================

export default function HealthTrackerSystem() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Firebase-connected state
  const [userData, setUserData] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  // Load data from Firebase when app starts
  useEffect(() => {
    async function loadData() {
      console.log('Loading data from Firebase...');
      const user = await loadUserData();
      const today = await loadTodayData();
      
      console.log('Loaded user data:', user);
      console.log('Loaded today data:', today);
      
      setUserData(user);
      setTodayData(today);
      setLoading(false);
    }
    
    loadData();
  }, []);

  // Save userData to Firebase whenever it changes
  useEffect(() => {
    if (userData && !loading) {
      console.log('Saving user data to Firebase...');
      saveUserData(userData);
    }
  }, [userData, loading]);

  // Save todayData to Firebase whenever it changes
  useEffect(() => {
    if (todayData && !loading) {
      console.log('Saving today data to Firebase...');
      saveTodayData(todayData);
    }
  }, [todayData, loading]);

  // Show loading screen while data loads
  if (loading || !userData || !todayData) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-2xl text-zinc-400 animate-pulse">Loading your data...</div>
      </div>
    );
  }

  // Navigation
  const views = {
    dashboard: <Dashboard userData={userData} todayData={todayData} setCurrentView={setCurrentView} />,
    workout: <WorkoutTracker todayData={todayData} setTodayData={setTodayData} userData={userData} setUserData={setUserData} />,
    nutrition: <NutritionTracker todayData={todayData} setTodayData={setTodayData} />,
    shop: <XPShop cart={cart} setCart={setCart} userData={userData} setUserData={setUserData} purchaseHistory={purchaseHistory} setPurchaseHistory={setPurchaseHistory} />,
    habits: <HabitsTracker todayData={todayData} setTodayData={setTodayData} userData={userData} setUserData={setUserData} />,
    stats: <StatsView userData={userData} todayData={todayData} purchaseHistory={purchaseHistory} />
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">LEVEL {userData.level}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-400">{userData.currentXP} XP</div>
              <div className="text-xs text-zinc-500">{userData.streak} day streak</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {views[currentView]}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-md mx-auto px-2 py-2 flex justify-around">
          <NavButton icon={Calendar} label="Home" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <NavButton icon={Dumbbell} label="Workout" active={currentView === 'workout'} onClick={() => setCurrentView('workout')} />
          <NavButton icon={Droplet} label="Habits" active={currentView === 'habits'} onClick={() => setCurrentView('habits')} />
          <NavButton icon={ShoppingCart} label="Shop" active={currentView === 'shop'} onClick={() => setCurrentView('shop')} badge={cart.length} />
          <NavButton icon={TrendingUp} label="Stats" active={currentView === 'stats'} onClick={() => setCurrentView('stats')} />
        </div>
      </nav>
    </div>
  );
}

// ==================== COMPONENTS ====================

function NavButton({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative ${
        active ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function Dashboard({ userData, todayData, setCurrentView }) {
  const dailyGoals = {
    workout: todayData.workout.completed,
    calories: todayData.nutrition.calories >= 2000,
    protein: todayData.nutrition.protein >= 150,
    water: todayData.waterIntake >= 3000,
    skincare: todayData.habits.skincare_morning && todayData.habits.skincare_night
  };

  const completedGoals = Object.values(dailyGoals).filter(Boolean).length;
  const totalGoals = Object.keys(dailyGoals).length;

  return (
    <div className="p-4 space-y-4">
      {/* Today's Progress */}
      <section className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Today's Quests
        </h2>
        
        <div className="space-y-2">
          <QuestItem 
            label="Complete Workout" 
            completed={dailyGoals.workout} 
            xp="180 XP"
            onClick={() => setCurrentView('workout')}
          />
          <QuestItem 
            label="Hit Calorie Target (2000)" 
            completed={dailyGoals.calories} 
            xp="30 XP"
            onClick={() => setCurrentView('nutrition')}
          />
          <QuestItem 
            label="Hit Protein Target (150g)" 
            completed={dailyGoals.protein} 
            xp="30 XP"
            onClick={() => setCurrentView('nutrition')}
          />
          <QuestItem 
            label="Drink 3L Water" 
            completed={dailyGoals.water} 
            xp="20 XP"
            onClick={() => setCurrentView('habits')}
          />
          <QuestItem 
            label="Skincare Routine" 
            completed={dailyGoals.skincare} 
            xp="20 XP"
            onClick={() => setCurrentView('habits')}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-700">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Progress</span>
            <span className="text-zinc-300">{completedGoals}/{totalGoals}</span>
          </div>
          <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(completedGoals / totalGoals) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Nutrition Summary */}
      <section className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h2 className="text-lg font-semibold mb-3">Nutrition</h2>
        <div className="grid grid-cols-2 gap-3">
          <MacroCard label="Calories" current={todayData.nutrition.calories} target={2000} unit="cal" />
          <MacroCard label="Protein" current={todayData.nutrition.protein} target={150} unit="g" />
          <MacroCard label="Carbs" current={todayData.nutrition.carbs} target={200} unit="g" />
          <MacroCard label="Fat" current={todayData.nutrition.fat} target={60} unit="g" />
        </div>
        <button 
          onClick={() => setCurrentView('nutrition')}
          className="w-full mt-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
        >
          Log Meal
        </button>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setCurrentView('workout')}
          className="bg-orange-600 hover:bg-orange-700 p-4 rounded-lg transition-colors"
        >
          <Dumbbell className="w-6 h-6 mb-2" />
          <div className="text-sm font-medium">Start Workout</div>
        </button>
        <button 
          onClick={() => setCurrentView('shop')}
          className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-colors"
        >
          <ShoppingCart className="w-6 h-6 mb-2" />
          <div className="text-sm font-medium">XP Shop</div>
        </button>
      </section>
    </div>
  );
}

function QuestItem({ label, completed, xp, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 bg-zinc-900 hover:bg-zinc-750 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        {completed ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <div className="w-5 h-5 border-2 border-zinc-600 rounded-full" />
        )}
        <span className={`text-sm ${completed ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
          {label}
        </span>
      </div>
      <span className="text-xs text-blue-400">{xp}</span>
    </button>
  );
}

function MacroCard({ label, current, target, unit }) {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div className="bg-zinc-900 p-3 rounded-lg">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="text-lg font-bold mb-2">
        <span className={isComplete ? 'text-green-400' : 'text-zinc-300'}>{Math.round(current)}</span>
        <span className="text-zinc-600 text-sm">/{target}{unit}</span>
      </div>
      <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function WorkoutTracker({ todayData, setTodayData, userData, setUserData }) {
  const [selectedDay, setSelectedDay] = useState('push');
  const [rounds, setRounds] = useState([0, 0, 0, 0, 0]);
  const [isComplete, setIsComplete] = useState(false);

  const exercises = EXERCISES[selectedDay];
  const totalXP = exercises.reduce((sum, ex, i) => sum + (ex.xpPerRound * rounds[i]), 0);

  const completeWorkout = () => {
    if (totalXP === 0) {
      alert("Complete at least 1 round to earn XP!");
      return;
    }

    setTodayData(prev => ({
      ...prev,
      workout: { completed: true, type: selectedDay, rounds, exercises }
    }));

    setUserData(prev => ({
      ...prev,
      currentXP: prev.currentXP + totalXP,
      totalXPEarned: prev.totalXPEarned + totalXP
    }));

    setIsComplete(true);
    
    setTimeout(() => {
      setIsComplete(false);
    }, 3000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* XP Banner */}
      {isComplete && (
        <div className="bg-green-600 p-4 rounded-lg animate-pulse">
          <div className="text-center">
            <div className="text-2xl font-bold">+{totalXP} XP EARNED!</div>
            <div className="text-sm mt-1">Great work. Keep pushing.</div>
          </div>
        </div>
      )}

      {/* Workout Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedDay('push')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedDay === 'push' ? 'bg-orange-600' : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          Push
        </button>
        <button
          onClick={() => setSelectedDay('pull')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedDay === 'pull' ? 'bg-orange-600' : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          Pull
        </button>
        <button
          onClick={() => setSelectedDay('legs')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedDay === 'legs' ? 'bg-orange-600' : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          Legs
        </button>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium">{exercise.name}</div>
                <div className="text-xs text-zinc-500">{exercise.duration}s work</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-400">{exercise.xpPerRound} XP/round</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRounds(prev => {
                  const newRounds = [...prev];
                  newRounds[index] = Math.max(0, newRounds[index] - 1);
                  return newRounds;
                })}
                className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-lg font-bold transition-colors"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold">{rounds[index]}</div>
                <div className="text-xs text-zinc-500">rounds</div>
              </div>
              <button
                onClick={() => setRounds(prev => {
                  const newRounds = [...prev];
                  newRounds[index] = Math.min(10, newRounds[index] + 1);
                  return newRounds;
                })}
                className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-lg font-bold transition-colors"
              >
                +
              </button>
            </div>

            {rounds[index] > 0 && (
              <div className="mt-2 text-center text-sm text-green-400">
                +{exercise.xpPerRound * rounds[index]} XP
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-blue-400">{totalXP} XP</div>
          <div className="text-xs text-zinc-500">Total earned this workout</div>
        </div>
        <button
          onClick={completeWorkout}
          disabled={todayData.workout.completed}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            todayData.workout.completed
              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {todayData.workout.completed ? 'Workout Completed ✓' : 'Complete Workout'}
        </button>
      </div>
    </div>
  );
}

function NutritionTracker({ todayData, setTodayData }) {
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addMeal = () => {
    if (!selectedFood) return;

    const meal = {
      ...selectedFood,
      quantity,
      totalCalories: selectedFood.calories * quantity,
      totalProtein: selectedFood.protein * quantity,
      totalCarbs: selectedFood.carbs * quantity,
      totalFat: selectedFood.fat * quantity,
      timestamp: Date.now()
    };

    setTodayData(prev => ({
      ...prev,
      nutrition: {
        calories: prev.nutrition.calories + meal.totalCalories,
        protein: prev.nutrition.protein + meal.totalProtein,
        carbs: prev.nutrition.carbs + meal.totalCarbs,
        fat: prev.nutrition.fat + meal.totalFat,
        meals: [...prev.nutrition.meals, meal]
      }
    }));

    setSelectedFood(null);
    setQuantity(1);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Food Selector */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <label className="block text-sm font-medium mb-2">Select Food</label>
        <select
          value={selectedFood?.name || ''}
          onChange={(e) => {
            const food = INDIAN_FOODS.find(f => f.name === e.target.value);
            setSelectedFood(food);
          }}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Choose a food...</option>
          {INDIAN_FOODS.map(food => (
            <option key={food.name} value={food.name}>{food.name}</option>
          ))}
        </select>

        {selectedFood && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-zinc-900 p-2 rounded text-center">
                <div className="text-zinc-500">Cal</div>
                <div className="font-bold">{selectedFood.calories}</div>
              </div>
              <div className="bg-zinc-900 p-2 rounded text-center">
                <div className="text-zinc-500">P</div>
                <div className="font-bold">{selectedFood.protein}g</div>
              </div>
              <div className="bg-zinc-900 p-2 rounded text-center">
                <div className="text-zinc-500">C</div>
                <div className="font-bold">{selectedFood.carbs}g</div>
              </div>
              <div className="bg-zinc-900 p-2 rounded text-center">
                <div className="text-zinc-500">F</div>
                <div className="font-bold">{selectedFood.fat}g</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-lg font-bold"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <div className="text-xl font-bold">{quantity}</div>
                <div className="text-xs text-zinc-500">{selectedFood.unit || 'serving'}</div>
              </div>
              <button
                onClick={() => setQuantity(quantity + 0.5)}
                className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-lg font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={addMeal}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Add to Today
            </button>
          </div>
        )}
      </div>

      {/* Today's Meals */}
      {todayData.nutrition.meals.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <h3 className="font-semibold mb-3">Today's Meals</h3>
          <div className="space-y-2">
            {todayData.nutrition.meals.map((meal, i) => (
              <div key={i} className="bg-zinc-900 p-3 rounded-lg text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{meal.name}</span>
                  <span className="text-zinc-500">×{meal.quantity}</span>
                </div>
                <div className="text-xs text-zinc-500">
                  {Math.round(meal.totalCalories)}cal • {Math.round(meal.totalProtein)}g P • {Math.round(meal.totalCarbs)}g C • {Math.round(meal.totalFat)}g F
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HabitsTracker({ todayData, setTodayData, userData, setUserData }) {
  const toggleHabit = (habitId, xp) => {
    const isCurrentlyChecked = todayData.habits[habitId];
    
    setTodayData(prev => ({
      ...prev,
      habits: {
        ...prev.habits,
        [habitId]: !isCurrentlyChecked
      }
    }));

    if (!isCurrentlyChecked) {
      setUserData(prev => ({
        ...prev,
        currentXP: prev.currentXP + xp,
        totalXPEarned: prev.totalXPEarned + xp
      }));
    }
  };

  const updateWater = (amount) => {
    const newTotal = Math.max(0, todayData.waterIntake + amount);
    const oldReachedGoal = todayData.waterIntake >= 3000;
    const newReachedGoal = newTotal >= 3000;
    
    setTodayData(prev => ({
      ...prev,
      waterIntake: newTotal
    }));

    if (!oldReachedGoal && newReachedGoal) {
      setUserData(prev => ({
        ...prev,
        currentXP: prev.currentXP + 20,
        totalXPEarned: prev.totalXPEarned + 20
      }));
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Water Tracker */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Water Intake</span>
          </div>
          <span className="text-blue-400 text-sm">20 XP</span>
        </div>
        
        <div className="text-center mb-3">
          <div className="text-3xl font-bold">{todayData.waterIntake}ml</div>
          <div className="text-sm text-zinc-500">/ 3000ml</div>
        </div>

        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${Math.min((todayData.waterIntake / 3000) * 100, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateWater(250)}
            className="py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
          >
            +250ml
          </button>
          <button
            onClick={() => updateWater(500)}
            className="py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
          >
            +500ml
          </button>
          <button
            onClick={() => updateWater(-250)}
            className="py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors"
          >
            -250ml
          </button>
        </div>
      </div>

      {/* Daily Habits */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h3 className="font-semibold mb-3">Daily Habits</h3>
        <div className="space-y-2">
          {DAILY_HABITS.filter(h => h.id !== 'water_3l').map(habit => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id, habit.xp)}
              className="w-full flex items-center justify-between p-3 bg-zinc-900 hover:bg-zinc-750 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                {todayData.habits[habit.id] ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-zinc-600 rounded-full" />
                )}
                <span className={`text-sm ${todayData.habits[habit.id] ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
                  {habit.name}
                </span>
              </div>
              <span className="text-xs text-blue-400">{habit.xp} XP</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Flame, ShoppingCart, X, Info } from 'lucide-react';

const JUNK_FOODS = [
  {
    name: "Pizza Slice",
    xp: 150,
    calories: 285,
    type: "Fast Food",
    image: "🍕",
    nutrition: {
      protein: "12g",
      carbs: "36g",
      fat: "10g",
      sugar: "3g",
      sodium: "640mg",
      description: "A classic cheese slice - delicious but high in sodium and refined carbs."
    }
  },
  {
    name: "Burger",
    xp: 200,
    calories: 354,
    type: "Fast Food",
    image: "🍔",
    nutrition: {
      protein: "25g",
      carbs: "35g",
      fat: "15g",
      sugar: "7g",
      sodium: "510mg",
      description: "Beef patty with cheese and bun - good protein but high in saturated fat."
    }
  },
  {
    name: "French Fries",
    xp: 120,
    calories: 312,
    type: "Fast Food",
    image: "🍟",
    nutrition: {
      protein: "3g",
      carbs: "41g",
      fat: "15g",
      sugar: "0g",
      sodium: "210mg",
      description: "Deep-fried potatoes - high in empty calories and trans fats."
    }
  },
  {
    name: "Ice Cream",
    xp: 100,
    calories: 207,
    type: "Dessert",
    image: "🍦",
    nutrition: {
      protein: "3g",
      carbs: "24g",
      fat: "11g",
      sugar: "21g",
      sodium: "80mg",
      description: "Creamy vanilla ice cream - loaded with sugar and saturated fat."
    }
  },
  {
    name: "Donut",
    xp: 80,
    calories: 195,
    type: "Dessert",
    image: "🍩",
    nutrition: {
      protein: "2g",
      carbs: "25g",
      fat: "11g",
      sugar: "13g",
      sodium: "170mg",
      description: "Glazed donut - pure sugar rush with minimal nutritional value."
    }
  },
  {
    name: "Soda",
    xp: 60,
    calories: 150,
    type: "Drink",
    image: "🥤",
    nutrition: {
      protein: "0g",
      carbs: "39g",
      fat: "0g",
      sugar: "39g",
      sodium: "45mg",
      description: "Carbonated sugar water - empty calories with no nutritional benefits."
    }
  },
  {
    name: "Chocolate Bar",
    xp: 90,
    calories: 210,
    type: "Snack",
    image: "🍫",
    nutrition: {
      protein: "3g",
      carbs: "26g",
      fat: "13g",
      sugar: "24g",
      sodium: "35mg",
      description: "Milk chocolate - high in sugar and saturated fats."
    }
  },
  {
    name: "Chips",
    xp: 70,
    calories: 152,
    type: "Snack",
    image: "🥔",
    nutrition: {
      protein: "2g",
      carbs: "15g",
      fat: "10g",
      sugar: "0g",
      sodium: "170mg",
      description: "Potato chips - high in sodium and unhealthy fats."
    }
  }
];

function XPShop({ cart, setCart, userData, setUserData, purchaseHistory, setPurchaseHistory }) {
  const [view, setView] = useState('shop');
  const [selectedItem, setSelectedItem] = useState(null);

  const addToCart = (item) => {
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
      setCart(cart.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemName) => {
    setCart(cart.filter(i => i.name !== itemName));
  };

  const updateQuantity = (itemName, delta) => {
    setCart(cart.map(i => {
      if (i.name === itemName) {
        const newQty = Math.max(0, i.quantity + delta);
        return newQty === 0 ? null : { ...i, quantity: newQty };
      }
      return i;
    }).filter(Boolean));
  };

  const totalXP = cart.reduce((sum, item) => sum + (item.xp * item.quantity), 0);

  const checkout = () => {
    if (cart.length === 0) return;
    
    if (totalXP > userData.currentXP) {
      alert("Not enough XP! Keep grinding.");
      return;
    }

    const purchase = {
      items: [...cart],
      totalXP,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    setPurchaseHistory([purchase, ...purchaseHistory]);
    setUserData(prev => ({
      ...prev,
      currentXP: prev.currentXP - totalXP,
      totalXPSpent: prev.totalXPSpent + totalXP
    }));

    setCart([]);
    setView('history');

    alert(`Purchase complete! You spent ${totalXP} XP. That was ${Math.ceil(totalXP / 180)} days of workouts. Worth it?`);
  };

  // Nutrition Info Modal
  const NutritionModal = ({ item, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-xl max-w-md w-full border border-zinc-700">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {item.image} {item.name}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">{item.image}</div>
            <p className="text-zinc-400 text-sm">{item.type}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-400">{item.calories}</div>
              <div className="text-xs text-zinc-400">Calories</div>
            </div>
            <div className="bg-zinc-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">{item.xp} XP</div>
              <div className="text-xs text-zinc-400">Cost</div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-3 text-sm">Nutrition Facts</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Protein</span>
                <span>{item.nutrition.protein}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Carbohydrates</span>
                <span>{item.nutrition.carbs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fat</span>
                <span>{item.nutrition.fat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sugar</span>
                <span>{item.nutrition.sugar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sodium</span>
                <span>{item.nutrition.sodium}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-400 italic text-center">
            {item.nutrition.description}
          </p>

          <button
            onClick={() => {
              addToCart(item);
              onClose();
            }}
            className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            Add to Cart - {item.xp} XP
          </button>
        </div>
      </div>
    </div>
  );

  if (view === 'history') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('shop')}
            className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
          >
            Shop
          </button>
          <button
            onClick={() => setView('history')}
            className="flex-1 py-2 bg-purple-600 rounded-lg text-sm"
          >
            History
          </button>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <h3 className="font-semibold mb-3">Purchase History</h3>
          {purchaseHistory.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">No purchases yet. Stay disciplined.</p>
          ) : (
            <div className="space-y-3">
              {purchaseHistory.map((purchase, i) => (
                <div key={i} className="bg-zinc-900 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-zinc-500">
                      {new Date(purchase.date).toLocaleDateString()} • {new Date(purchase.date).toLocaleTimeString()}
                    </span>
                    <span className="text-sm font-bold text-red-400">-{purchase.totalXP} XP</span>
                  </div>
                  <div className="space-y-1">
                    {purchase.items.map((item, j) => (
                      <div key={j} className="text-sm text-zinc-300 flex items-center gap-2">
                        <span>{item.image}</span>
                        <span>{item.name} ×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {selectedItem && <NutritionModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      
      <div className="flex gap-2">
        <button
          onClick={() => setView('shop')}
          className="flex-1 py-2 bg-purple-600 rounded-lg text-sm"
        >
          Shop
        </button>
        <button
          onClick={() => setView('history')}
          className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
        >
          History
        </button>
      </div>

      {/* Balance Display */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl p-4 border border-purple-700">
        <div className="text-sm text-purple-200 mb-1">Your Balance</div>
        <div className="text-3xl font-bold">{userData.currentXP} XP</div>
      </div>

      {/* Shop Items Grid */}
      <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Indulgences
        </h3>
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {JUNK_FOODS.map(item => (
            <div 
              key={item.name} 
              className="bg-zinc-900 rounded-lg p-3 border border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="text-center mb-2">
                <div className="text-4xl mb-1">{item.image}</div>
                <div className="font-medium text-sm mb-1">{item.name}</div>
                <div className="text-xs text-zinc-500">{item.calories} cal</div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-400">{item.xp} XP</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
                >
                  Add
                </button>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                className="w-full mt-2 flex items-center justify-center gap-1 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
              >
                <Info className="w-3 h-3" />
                Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart ({cart.length})
          </h3>
          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div key={item.name} className="bg-zinc-900 p-3 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{item.image}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-zinc-500">{item.xp} XP each</div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="text-red-400 text-xs hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.name, -1)}
                      className="w-6 h-6 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, 1)}
                      className="w-6 h-6 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-purple-400">{item.xp * item.quantity} XP</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-700 pt-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-purple-400">{totalXP} XP</span>
            </div>
            <div className="text-xs text-zinc-500 mb-3 text-center">
              That's {Math.ceil(totalXP / 180)} days of workouts. Sure?
            </div>
            <button
              onClick={checkout}
              disabled={totalXP > userData.currentXP}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                totalXP > userData.currentXP
                  ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {totalXP > userData.currentXP ? 'Not Enough XP' : 'Complete Purchase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

//export default XPShop;
// function XPShop({ cart, setCart, userData, setUserData, purchaseHistory, setPurchaseHistory }) {
//   const [view, setView] = useState('shop');

//   const addToCart = (item) => {
//     const existing = cart.find(i => i.name === item.name);
//     if (existing) {
//       setCart(cart.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i));
//     } else {
//       setCart([...cart, { ...item, quantity: 1 }]);
//     }
//   };

//   const removeFromCart = (itemName) => {
//     setCart(cart.filter(i => i.name !== itemName));
//   };

//   const updateQuantity = (itemName, delta) => {
//     setCart(cart.map(i => {
//       if (i.name === itemName) {
//         const newQty = Math.max(0, i.quantity + delta);
//         return newQty === 0 ? null : { ...i, quantity: newQty };
//       }
//       return i;
//     }).filter(Boolean));
//   };

//   const totalXP = cart.reduce((sum, item) => sum + (item.xp * item.quantity), 0);

//   const checkout = () => {
//     if (cart.length === 0) return;
    
//     if (totalXP > userData.currentXP) {
//       alert("Not enough XP! Keep grinding.");
//       return;
//     }

//     const purchase = {
//       items: [...cart],
//       totalXP,
//       date: new Date().toISOString(),
//       timestamp: Date.now()
//     };

//     setPurchaseHistory([purchase, ...purchaseHistory]);
//     setUserData(prev => ({
//       ...prev,
//       currentXP: prev.currentXP - totalXP,
//       totalXPSpent: prev.totalXPSpent + totalXP
//     }));

//     setCart([]);
//     setView('history');

//     alert(`Purchase complete! You spent ${totalXP} XP. That was ${Math.ceil(totalXP / 180)} days of workouts. Worth it?`);
//   };

//   if (view === 'history') {
//     return (
//       <div className="p-4 space-y-4">
//         <div className="flex gap-2">
//           <button
//             onClick={() => setView('shop')}
//             className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
//           >
//             Shop
//           </button>
//           <button
//             onClick={() => setView('history')}
//             className="flex-1 py-2 bg-purple-600 rounded-lg text-sm"
//           >
//             History
//           </button>
//         </div>

//         <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
//           <h3 className="font-semibold mb-3">Purchase History</h3>
//           {purchaseHistory.length === 0 ? (
//             <p className="text-sm text-zinc-500 text-center py-4">No purchases yet. Stay disciplined.</p>
//           ) : (
//             <div className="space-y-3">
//               {purchaseHistory.map((purchase, i) => (
//                 <div key={i} className="bg-zinc-900 p-3 rounded-lg">
//                   <div className="flex justify-between items-start mb-2">
//                     <span className="text-xs text-zinc-500">
//                       {new Date(purchase.date).toLocaleDateString()} • {new Date(purchase.date).toLocaleTimeString()}
//                     </span>
//                     <span className="text-sm font-bold text-red-400">-{purchase.totalXP} XP</span>
//                   </div>
//                   <div className="space-y-1">
//                     {purchase.items.map((item, j) => (
//                       <div key={j} className="text-sm text-zinc-300">
//                         {item.name} ×{item.quantity}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex gap-2">
//         <button
//           onClick={() => setView('shop')}
//           className="flex-1 py-2 bg-purple-600 rounded-lg text-sm"
//         >
//           Shop
//         </button>
//         <button
//           onClick={() => setView('history')}
//           className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
//         >
//           History
//         </button>
//       </div>

//       {/* Balance Display */}
//       <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
//         <div className="text-sm text-purple-200 mb-1">Your Balance</div>
//         <div className="text-3xl font-bold">{userData.currentXP} XP</div>
//       </div>

//       {/* Shop Items */}
//       <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
//         <h3 className="font-semibold mb-3 flex items-center gap-2">
//           <Flame className="w-5 h-5 text-orange-500" />
//           Indulgences
//         </h3>
//         <div className="space-y-2 max-h-96 overflow-y-auto">
//           {JUNK_FOODS.map(item => (
//             <div key={item.name} className="bg-zinc-900 p-3 rounded-lg flex items-center justify-between">
//               <div className="flex-1">
//                 <div className="font-medium text-sm">{item.name}</div>
//                 <div className="text-xs text-zinc-500">{item.calories} cal • {item.type}</div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-bold text-purple-400">{item.xp} XP</span>
//                 <button
//                   onClick={() => addToCart(item)}
//                   className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Cart */}
//       {cart.length > 0 && (
//         <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
//           <h3 className="font-semibold mb-3 flex items-center gap-2">
//             <ShoppingCart className="w-5 h-5" />
//             Cart ({cart.length})
//           </h3>
//           <div className="space-y-2 mb-4">
//             {cart.map(item => (
//               <div key={item.name} className="bg-zinc-900 p-3 rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="font-medium text-sm">{item.name}</span>
//                   <button
//                     onClick={() => removeFromCart(item.name)}
//                     className="text-red-400 text-xs hover:text-red-300"
//                   >
//                     Remove
//                   </button>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => updateQuantity(item.name, -1)}
//                       className="w-6 h-6 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
//                     >
//                       -
//                     </button>
//                     <span className="text-sm w-8 text-center">{item.quantity}</span>
//                     <button
//                       onClick={() => updateQuantity(item.name, 1)}
//                       className="w-6 h-6 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <span className="text-sm text-purple-400">{item.xp * item.quantity} XP</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-zinc-700 pt-3">
//             <div className="flex justify-between items-center mb-3">
//               <span className="font-semibold">Total</span>
//               <span className="text-xl font-bold text-purple-400">{totalXP} XP</span>
//             </div>
//             <div className="text-xs text-zinc-500 mb-3 text-center">
//               That's {Math.ceil(totalXP / 180)} days of workouts. Sure?
//             </div>
//             <button
//               onClick={checkout}
//               disabled={totalXP > userData.currentXP}
//               className={`w-full py-3 rounded-lg font-semibold transition-colors ${
//                 totalXP > userData.currentXP
//                   ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
//                   : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {totalXP > userData.currentXP ? 'Not Enough XP' : 'Complete Purchase'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

function StatsView({ userData, todayData, purchaseHistory }) {
  const totalEarned = userData.totalXPEarned;
  const totalSpent = userData.totalXPSpent;
  const savingsRate = totalEarned > 0 ? ((totalEarned - totalSpent) / totalEarned * 100).toFixed(1) : 0;

  return (
    <div className="p-4 space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-1">Current Streak</div>
          <div className="text-2xl font-bold text-orange-400">{userData.streak}</div>
          <div className="text-xs text-zinc-500">days</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-1">Longest Streak</div>
          <div className="text-2xl font-bold text-green-400">{userData.longestStreak}</div>
          <div className="text-xs text-zinc-500">days</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-1">Total XP Earned</div>
          <div className="text-2xl font-bold text-blue-400">{totalEarned}</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-1">Total XP Spent</div>
          <div className="text-2xl font-bold text-purple-400">{totalSpent}</div>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Savings Rate</span>
          <span className="text-lg font-bold text-green-400">{savingsRate}%</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500"
            style={{ width: `${savingsRate}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          {savingsRate > 70 ? 'Excellent discipline!' : savingsRate > 50 ? 'Good control.' : 'Need more discipline.'}
        </p>
      </div>

      {/* Today's Summary */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h3 className="font-semibold mb-3">Today's Performance</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Workout</span>
            <span className={todayData.workout.completed ? 'text-green-400' : 'text-red-400'}>
              {todayData.workout.completed ? 'Completed ✓' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Calories</span>
            <span>{Math.round(todayData.nutrition.calories)} / 2000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Protein</span>
            <span>{Math.round(todayData.nutrition.protein)}g / 150g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Water</span>
            <span>{todayData.waterIntake}ml / 3000ml</span>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 border border-blue-700">
        <div className="text-sm leading-relaxed">
          <p className="mb-2">
            You're on day <strong>{userData.streak}</strong> of your journey.
          </p>
          <p className="text-zinc-300">
            {userData.streak < 7 
              ? "The first week is always the hardest. Push through."
              : userData.streak < 30
              ? "You're building real habits now. Don't stop."
              : userData.streak < 90
              ? "This is where most people quit. You're stronger than that."
              : "You've proven your discipline. This is who you are now. Keep going."}
          </p>
        </div>
      </div>
    </div>
  );
}