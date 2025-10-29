import React, { useState, useEffect } from 'react';
import { Camera, X, Search, Calendar, Dumbbell, ShoppingCart, TrendingUp, Flame, Droplet, Award, AlertCircle, CheckCircle, Clock, Zap, ChevronRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { loadUserData, saveUserData, loadTodayData, saveTodayData, savePurchase, loadPurchaseHistory, uploadWorkoutPhoto, uploadPurchasePhoto, getLastPurchaseDate, saveWorkoutCompletion } from './firebase';

// ==================== DATA STRUCTURES ====================

const WORKOUT_SCHEDULE = {
  1: {
    name: "Core + Shoulders Day",
    exercises: [
      { name: "Pike Push-ups", sets: 3, reps: 12, xp: 15 },
      { name: "Shoulder Taps", sets: 3, reps: 20, xp: 12 },
      { name: "Plank", sets: 3, duration: "60s", xp: 18 },
      { name: "Russian Twists", sets: 3, reps: 30, xp: 14 },
      { name: "Mountain Climbers", sets: 3, reps: 20, xp: 16 }
    ]
  },
  2: {
    name: "Back + Core Day",
    exercises: [
      { name: "Australian Pull-ups", sets: 3, reps: 10, xp: 20 },
      { name: "Superman Holds", sets: 3, duration: "45s", xp: 15 },
      { name: "Plank to Downward Dog", sets: 3, reps: 12, xp: 14 },
      { name: "Dead Bug", sets: 3, reps: 20, xp: 12 },
      { name: "Hollow Body Hold", sets: 3, duration: "30s", xp: 16 }
    ]
  },
  3: {
    name: "Chest + Core Day",
    exercises: [
      { name: "Push-ups", sets: 3, reps: 15, xp: 18 },
      { name: "Diamond Push-ups", sets: 3, reps: 10, xp: 20 },
      { name: "Plank Jacks", sets: 3, reps: 20, xp: 14 },
      { name: "Bicycle Crunches", sets: 3, reps: 30, xp: 12 },
      { name: "Leg Raises", sets: 3, reps: 15, xp: 16 }
    ]
  },
  4: {
    name: "Legs + Core Day",
    exercises: [
      { name: "Squats", sets: 3, reps: 20, xp: 16 },
      { name: "Lunges", sets: 3, reps: 16, xp: 18 },
      { name: "Glute Bridges", sets: 3, reps: 20, xp: 14 },
      { name: "Plank", sets: 3, duration: "60s", xp: 18 },
      { name: "Side Plank", sets: 3, duration: "30s", xp: 15 }
    ]
  },
  5: {
    name: "Shoulders + Core Day",
    exercises: [
      { name: "Pike Push-ups", sets: 3, reps: 12, xp: 15 },
      { name: "Lateral Raises (water bottles)", sets: 3, reps: 15, xp: 12 },
      { name: "Plank Shoulder Taps", sets: 3, reps: 20, xp: 16 },
      { name: "Russian Twists", sets: 3, reps: 30, xp: 14 },
      { name: "Flutter Kicks", sets: 3, reps: 30, xp: 13 }
    ]
  },
  6: {
    name: "Legs + Core Day",
    exercises: [
      { name: "Jump Squats", sets: 3, reps: 15, xp: 20 },
      { name: "Bulgarian Split Squats", sets: 3, reps: 12, xp: 18 },
      { name: "Calf Raises", sets: 3, reps: 25, xp: 10 },
      { name: "V-Ups", sets: 3, reps: 15, xp: 16 },
      { name: "Plank", sets: 3, duration: "60s", xp: 18 }
    ]
  },
  7: {
    name: "Active Rest (15,000 Steps)",
    exercises: [
      { name: "Walking/Light Stretching", sets: 1, duration: "60min", xp: 50 }
    ]
  }
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

const JUNK_FOODS = [
  { 
    name: "Lays Chips (pack)", 
    xp: 160, 
    calories: 200, 
    type: "chips",
    imageUrl: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400",
    cons: ["High sodium", "Zero nutritional value", "Addictive", "Bloating"],
    warning: "This will undo 1 full workout session. Your sodium intake will spike.",
    impactDays: 1
  },
  { 
    name: "Kurkure (pack)", 
    xp: 176, 
    calories: 220, 
    type: "chips",
    imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400",
    cons: ["Artificial flavors", "Trans fats", "High calories", "Digestive issues"],
    warning: "Contains harmful additives. Will cost you 1 day of discipline.",
    impactDays: 1
  },
  { 
    name: "Maggi", 
    xp: 320, 
    calories: 400, 
    type: "instant",
    imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400",
    cons: ["MSG", "High sodium", "Preservatives", "Empty carbs"],
    warning: "This will cost you 2 full workout days. High sodium = water retention.",
    impactDays: 2
  },
  { 
    name: "Dairy Milk", 
    xp: 224, 
    calories: 280, 
    type: "chocolate",
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
    cons: ["High sugar", "Quick insulin spike", "Addictive", "Empty calories"],
    warning: "Pure sugar bomb. Will crash your energy and cost 1.5 days of work.",
    impactDays: 1.5
  },
  { 
    name: "Coca Cola (250ml)", 
    xp: 84, 
    calories: 105, 
    type: "drink",
    imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
    cons: ["Liquid sugar", "Teeth damage", "Insulin spike", "Dehydration"],
    warning: "9 teaspoons of sugar in one glass. Costs you half a workout day.",
    impactDays: 0.5
  },
  { 
    name: "Chola Bhature", 
    xp: 336, 
    calories: 420, 
    type: "street_food",
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a65aded37?w=400",
    cons: ["Deep fried", "Heavy carbs", "Digestive load", "High calories"],
    warning: "Delicious but dangerous. This costs you 2 full workout days.",
    impactDays: 2
  },
  { 
    name: "Samosa (2 pieces)", 
    xp: 240, 
    calories: 300, 
    type: "street_food",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    cons: ["Deep fried", "Trans fats", "High carbs", "Low protein"],
    warning: "Fried dough bombs. Costs 1.5 days of workouts.",
    impactDays: 1.5
  },
  { 
    name: "Ice Cream (1 scoop)", 
    xp: 96, 
    calories: 120, 
    type: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    cons: ["High sugar", "Dairy fat", "Quick energy crash", "Addictive"],
    warning: "Sweet but costly. Half a workout day gone.",
    impactDays: 0.5
  }
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
  const [userData, setUserData] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      console.log('Loading data from Firebase...');
      const user = await loadUserData();
      const today = await loadTodayData();
      const purchases = await loadPurchaseHistory();
      
      if (isMounted) {
        setUserData(user);
        setTodayData(today);
        setPurchaseHistory(purchases);
        setLoading(false);
      }
    }
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (userData && !loading) {
      saveUserData(userData);
    }
  }, [userData, loading]);

  useEffect(() => {
    if (todayData && !loading) {
      saveTodayData(todayData);
    }
  }, [todayData, loading]);

  if (loading || !userData || !todayData) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-2xl text-zinc-400 animate-pulse">Loading your data...</div>
      </div>
    );
  }

  const views = {
    dashboard: <Dashboard userData={userData} todayData={todayData} setCurrentView={setCurrentView} />,
    workout: <WorkoutTracker todayData={todayData} setTodayData={setTodayData} userData={userData} setUserData={setUserData} />,
    nutrition: <NutritionTracker todayData={todayData} setTodayData={setTodayData} />,
    shop: selectedProduct ? (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
        cart={cart}
        setCart={setCart}
        userData={userData}
        purchaseHistory={purchaseHistory}
      />
    ) : (
      <XPShop 
        cart={cart} 
        setCart={setCart} 
        userData={userData} 
        setUserData={setUserData} 
        purchaseHistory={purchaseHistory} 
        setPurchaseHistory={setPurchaseHistory}
        setSelectedProduct={setSelectedProduct}
      />
    ),
    habits: <HabitsTracker todayData={todayData} setTodayData={setTodayData} userData={userData} setUserData={setUserData} />,
    stats: <StatsView userData={userData} todayData={todayData} purchaseHistory={purchaseHistory} />
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
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

      <main className="max-w-md mx-auto pb-20">
        {views[currentView]}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-md mx-auto px-2 py-2 flex justify-around">
          <NavButton icon={Calendar} label="Home" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <NavButton icon={Dumbbell} label="Workout" active={currentView === 'workout'} onClick={() => setCurrentView('workout')} />
          <NavButton icon={Droplet} label="Habits" active={currentView === 'habits'} onClick={() => setCurrentView('habits')} />
          <NavButton icon={ShoppingCart} label="Shop" active={currentView === 'shop'} onClick={() => { setCurrentView('shop'); setSelectedProduct(null); }} badge={cart.length} />
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
  const currentDay = (userData.streak % 7) + 1;
  const todayWorkout = WORKOUT_SCHEDULE[currentDay];

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
      <section className="bg-gradient-to-r from-orange-900 to-red-900 rounded-lg p-4 border border-orange-700">
        <div className="text-sm text-orange-200 mb-1">Today's Workout</div>
        <div className="text-xl font-bold mb-2">Day {currentDay}: {todayWorkout.name}</div>
        <button 
          onClick={() => setCurrentView('workout')}
          className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
        >
          {todayData.workout.completed ? 'Completed ✓' : 'Start Workout'}
        </button>
      </section>

      <section className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Today's Quests
        </h2>
        
        <div className="space-y-2">
          <QuestItem 
            label="Complete Workout" 
            completed={dailyGoals.workout} 
            xp="~180 XP"
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
  const currentDay = (userData.streak % 7) + 1;
  const workout = WORKOUT_SCHEDULE[currentDay];
  
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Photo selected:', file.name, file.type, file.size);
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const toggleExercise = (index) => {
    setExerciseProgress(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const totalXP = workout.exercises.reduce((sum, ex, i) => {
    return sum + (exerciseProgress[i] ? ex.xp : 0);
  }, 0);

  const completedExercises = Object.values(exerciseProgress).filter(Boolean).length;
  
  // FIXED: Proper button state logic
  const isWorkoutAlreadyCompleted = todayData.workout.completed;
  const hasCompletedExercises = completedExercises > 0;
  const hasPhoto = !!photoFile;
  const canComplete = !isWorkoutAlreadyCompleted && hasCompletedExercises && hasPhoto;

  const completeWorkout = async () => {
    if (!canComplete || uploading) {
      console.log('Cannot complete workout:', {
        alreadyCompleted: isWorkoutAlreadyCompleted,
        hasExercises: hasCompletedExercises,
        hasPhoto: hasPhoto,
        uploading: uploading
      });
      return;
    }

    setUploading(true);
    console.log('Starting workout completion process...');

    try {
      // Upload photo to Firebase
      console.log('Uploading workout photo to Firebase...');
      let photoURL = null;
      if (photoFile) {
        photoURL = await uploadWorkoutPhoto(photoFile);
        console.log('Photo uploaded successfully:', photoURL);
      }

      // Prepare workout data
      const workoutData = {
        completed: true,
        day: currentDay,
        workoutName: workout.name,
        exercises: exerciseProgress,
        photoURL: photoURL,
        xpEarned: totalXP,
        timestamp: new Date().toISOString()
      };

      // Save to workout history
      console.log('Saving workout to history...');
      await saveWorkoutCompletion(workoutData);

      // Update today's data
      console.log('Updating today data...');
      setTodayData(prev => ({
        ...prev,
        workout: {
          ...prev.workout,
          ...workoutData
        }
      }));

      // Update user data with XP and streak
      console.log('Updating user data...');
      setUserData(prev => ({
        ...prev,
        currentXP: prev.currentXP + totalXP,
        totalXPEarned: prev.totalXPEarned + totalXP,
        streak: prev.streak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.streak + 1)
      }));

      console.log('Workout completed successfully!');
      alert(`✅ Workout complete! +${totalXP} XP earned!`);

    } catch (error) {
      console.error('Error completing workout:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-orange-900 to-red-900 rounded-lg p-4 border border-orange-700">
        <div className="text-sm text-orange-200">Day {currentDay}</div>
        <div className="text-2xl font-bold mb-2">{workout.name}</div>
        <div className="text-sm text-orange-300">
          Complete exercises and add photo proof
        </div>
      </div>

      {/* Exercise Status */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-zinc-400">Exercise Progress</span>
          <span className="text-sm text-blue-400">
            {completedExercises}/{workout.exercises.length} completed
          </span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all"
            style={{ width: `${(completedExercises / workout.exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {workout.exercises.map((exercise, index) => (
          <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-medium">{exercise.name}</div>
                <div className="text-sm text-zinc-500">
                  {exercise.sets} sets × {exercise.reps || exercise.duration}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-400">{exercise.xp} XP</div>
                {exerciseProgress[index] && (
                  <div className="text-xs text-green-400 mt-1">Completed</div>
                )}
              </div>
            </div>
            
            <button
              onClick={() => toggleExercise(index)}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                exerciseProgress[index]
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
              }`}
            >
              {exerciseProgress[index] ? 'Completed ✓' : 'Mark as Done'}
            </button>
          </div>
        ))}
      </div>

      {/* Photo Upload Section */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-blue-400" />
          <span className="font-semibold">Workout Proof Photo</span>
          <span className={`text-xs ${photoFile ? 'text-green-400' : 'text-red-400'}`}>
            {photoFile ? 'Uploaded ✓' : '*Required'}
          </span>
        </div>

        {photoPreview ? (
          <div className="relative">
            <img src={photoPreview} alt="Workout proof" className="w-full h-48 object-cover rounded-lg" />
            <button
              onClick={() => {
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="block w-full p-8 border-2 border-dashed border-zinc-700 rounded-lg text-center cursor-pointer hover:border-zinc-600 transition-colors">
            <Camera className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
            <span className="text-sm text-zinc-400">Tap to add workout photo</span>
            <div className="text-xs text-zinc-500 mt-1">Required for completion</div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Complete Workout Section */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-blue-400">{totalXP} XP</div>
          <div className="text-xs text-zinc-500">Total earned this workout</div>
        </div>

        {/* Requirements Checklist */}
        <div className="space-y-2 mb-4 p-3 bg-zinc-900 rounded-lg">
          <div className={`flex items-center gap-2 text-sm ${hasCompletedExercises ? 'text-green-400' : 'text-yellow-400'}`}>
            {hasCompletedExercises ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            <span>Complete exercises ({completedExercises}/{workout.exercises.length})</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${hasPhoto ? 'text-green-400' : 'text-yellow-400'}`}>
            {hasPhoto ? <CheckCircle className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            <span>Add workout proof photo</span>
          </div>
          {isWorkoutAlreadyCompleted && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>Workout already completed today</span>
            </div>
          )}
        </div>

        {/* FIXED: Button with proper state handling */}
        <button
          onClick={completeWorkout}
          disabled={!canComplete || uploading}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            canComplete && !uploading
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          } ${todayData.workout.completed ? 'bg-green-800 text-green-200' : ''}`}
        >
          {uploading ? '📤 Uploading...' : 
           todayData.workout.completed ? '✅ Workout Completed' : 
           canComplete ? `🎯 Complete Workout (+${totalXP} XP)` : 
           'Complete Requirements First'}
        </button>

        {!canComplete && !todayData.workout.completed && (
          <div className="text-xs text-zinc-500 text-center mt-2">
            Mark exercises complete and add photo to enable
          </div>
        )}
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
        currentXP: prev.currentXP + xp
      }));
    }
  };

  const updateWaterIntake = (amount) => {
    setTodayData(prev => ({
      ...prev,
      waterIntake: Math.max(0, prev.waterIntake + amount)
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h2 className="text-lg font-semibold mb-3">Daily Habits</h2>
        <div className="space-y-2">
          {DAILY_HABITS.map(habit => (
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
              <span className="text-xs text-blue-400">+{habit.xp} XP</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h2 className="text-lg font-semibold mb-3">Water Intake</h2>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-blue-400">{todayData.waterIntake}ml</div>
          <div className="text-sm text-zinc-500">Target: 3000ml</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[250, 500, 1000, 2000].map(amount => (
            <button
              key={amount}
              onClick={() => updateWaterIntake(amount)}
              className="py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              +{amount}ml
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function XPShop({ cart, setCart, userData, setUserData, purchaseHistory, setPurchaseHistory, setSelectedProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const filteredProducts = JUNK_FOODS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const completePurchase = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    if (!photoFile) {
      alert("Please add a photo of your purchase!");
      return;
    }

    const totalXP = cart.reduce((sum, item) => sum + item.xp, 0);
    
    if (userData.currentXP < totalXP) {
      alert("Not enough XP!");
      return;
    }

    setUploading(true);

    try {
      const photoURL = await uploadPurchasePhoto(photoFile);
      
      const purchaseData = {
        items: cart,
        totalXP,
        photoURL,
        timestamp: new Date().toISOString()
      };

      await savePurchase(purchaseData);

      setUserData(prev => ({
        ...prev,
        currentXP: prev.currentXP - totalXP,
        totalXPWasted: (prev.totalXPWasted || 0) + totalXP
      }));

      setPurchaseHistory(prev => [purchaseData, ...prev]);
      setCart([]);
      setPhotoFile(null);
      setPhotoPreview(null);

      alert(`Purchase completed! -${totalXP} XP`);
    } catch (error) {
      alert("Error uploading photo. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-4 border border-purple-700">
        <div className="text-sm text-purple-200 mb-1">XP Balance</div>
        <div className="text-2xl font-bold text-blue-400">{userData.currentXP} XP</div>
        <div className="text-xs text-purple-300">Spend wisely!</div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search junk food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredProducts.map((product, index) => (
          <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex gap-4">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="font-medium mb-1">{product.name}</div>
                <div className="text-sm text-zinc-500 mb-2">
                  {product.calories} cal • {product.impactDays} day impact
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-400 font-bold">{product.xp} XP</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <h3 className="font-semibold mb-3">Cart ({cart.length})</h3>
          <div className="space-y-2 mb-4">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-zinc-900 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-red-400">{item.xp} XP</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="p-1 hover:bg-zinc-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Purchase Proof Photo</span>
              <span className="text-xs text-red-400">*Required</span>
            </div>

            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Purchase proof" className="w-full h-48 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full p-8 border-2 border-dashed border-zinc-700 rounded-lg text-center cursor-pointer hover:border-zinc-600">
                <Camera className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                <span className="text-sm text-zinc-400">Tap to add photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div className="font-semibold text-red-300">Warning</div>
            </div>
            <div className="text-sm text-red-200">
              This purchase will cost you {cart.reduce((sum, item) => sum + item.xp, 0)} XP and set you back {Math.max(...cart.map(item => item.impactDays))} days.
            </div>
          </div>

          <button
            onClick={completePurchase}
            disabled={uploading}
            className={`w-full mt-3 py-3 rounded-lg font-semibold transition-colors ${
              uploading
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {uploading ? 'Processing...' : `Confirm Purchase (-${cart.reduce((sum, item) => sum + item.xp, 0)} XP)`}
          </button>
        </div>
      )}
    </div>
  );
}

function ProductDetail({ product, onBack, cart, setCart, userData, purchaseHistory }) {
  const [lastPurchaseDate, setLastPurchaseDate] = useState(null);

  useEffect(() => {
    const loadLastPurchase = async () => {
      const date = await getLastPurchaseDate(product.name);
      setLastPurchaseDate(date);
    };
    loadLastPurchase();
  }, [product.name]);

  const addToCart = () => {
    setCart(prev => [...prev, product]);
    onBack();
  };

  const daysSinceLastPurchase = lastPurchaseDate 
    ? Math.floor((Date.now() - new Date(lastPurchaseDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </button>

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4">
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-900 p-3 rounded-lg">
              <div className="text-sm text-zinc-500">Cost</div>
              <div className="text-lg font-bold text-red-400">{product.xp} XP</div>
            </div>
            <div className="bg-zinc-900 p-3 rounded-lg">
              <div className="text-sm text-zinc-500">Calories</div>
              <div className="text-lg font-bold text-orange-400">{product.calories}</div>
            </div>
          </div>

          {daysSinceLastPurchase !== null && (
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  Last purchased {daysSinceLastPurchase} day{daysSinceLastPurchase !== 1 ? 's' : ''} ago
                </span>
              </div>
            </div>
          )}

          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div className="font-semibold text-red-300">Health Impact</div>
            </div>
            <div className="text-sm text-red-200 mb-3">
              {product.warning}
            </div>
            <div className="space-y-2">
              {product.cons.map((con, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span className="text-red-300">{con}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-900 border border-amber-700 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300">
                Equivalent to {product.impactDays} day{product.impactDays !== 1 ? 's' : ''} of workouts
              </span>
            </div>
          </div>

          <button
            onClick={addToCart}
            disabled={userData.currentXP < product.xp}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              userData.currentXP < product.xp
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {userData.currentXP < product.xp 
              ? 'Insufficient XP' 
              : `Add to Cart (-${product.xp} XP)`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsView({ userData, todayData, purchaseHistory }) {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  // Load workout history
  useEffect(() => {
    const loadWorkoutHistory = async () => {
      try {
        // You'll need to add this function to firebase.js
        const history = await loadWorkoutHistory();
        setWorkoutHistory(history);
      } catch (error) {
        console.error('Error loading workout history:', error);
      }
    };
    loadWorkoutHistory();
  }, []);

  const totalWorkouts = workoutHistory.length;
  const totalXPFromWorkouts = workoutHistory.reduce((sum, workout) => sum + (workout.xpEarned || 0), 0);

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
          <div className="text-xs text-zinc-500 mb-1">Total Workouts</div>
          <div className="text-2xl font-bold text-green-400">{totalWorkouts}</div>
          <div className="text-xs text-zinc-500">completed</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-1">Workout XP</div>
          <div className="text-2xl font-bold text-blue-400">{totalXPFromWorkouts}</div>
          <div className="text-xs text-zinc-500">earned</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <div className="text-xs text-zinc-500 mb-1">Junk Food</div>
          <div className="text-2xl font-bold text-red-400">{purchaseHistory.length}</div>
          <div className="text-xs text-zinc-500">purchases</div>
        </div>
      </div>

      {/* Recent Workouts with Images */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-orange-400" />
          Recent Workouts
        </h3>
        {workoutHistory.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <div>No workouts completed yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutHistory.slice(0, 5).map((workout, index) => (
              <div key={index} className="bg-zinc-900 p-3 rounded-lg">
                <div className="flex items-start gap-3">
                  {workout.photoURL && (
                    <img 
                      src={workout.photoURL} 
                      alt="Workout proof" 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      Day {workout.day}: {workout.workoutName}
                    </div>
                    <div className="text-xs text-zinc-500 mb-1">
                      {new Date(workout.timestamp).toLocaleDateString()} • 
                      <span className="text-green-400 ml-1">+{workout.xpEarned} XP</span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {Object.values(workout.exercises || {}).filter(Boolean).length} exercises completed
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rest of your stats component... */}
    </div>
  );
}