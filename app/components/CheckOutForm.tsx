"use client";
import { useToast } from "@/components/ui/use-toast";
import Checkout from "@/lib/Payment";
import { createAddress } from "@/providers/toolkit/features/CreateAddressForOrderSlice";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { useSession } from "next-auth/react";
import { use, useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Comprehensive Indian States and Cities Data
const INDIAN_STATES_CITIES: Record<string, string[]> = {
  "Andaman and Nicobar Islands": [
    "Port Blair", "Diglipur", "Mayabunder", "Rangat", "Car Nicobar", "Hut Bay", "Little Andaman", "Nancowry"
  ],
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Rajahmundry", "Kadapa", 
    "Anantapur", "Kurnool", "Eluru", "Ongole", "Vizianagaram", "Machilipatnam", "Tenali", "Chittoor", 
    "Hindupur", "Proddatur", "Bhimavaram", "Madanapalle", "Guntakal", "Dharmavaram", "Gudivada", "Srikakulam"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Tezu", "Seppa", "Changlang", 
    "Along", "Roing", "Namsai", "Khonsa"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur", "Tinsukia", "Bongaigaon", 
    "Barpeta", "Dhubri", "Goalpara", "Golaghat", "Karimganj", "Kokrajhar", "Hailakandi", "Hojai", 
    "Diphu", "Sivasagar", "Haflong", "Lakhimpur", "Mangaldoi", "Nalbari", "North Lakhimpur"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", 
    "Begusarai", "Katihar", "Munger", "Chhapra", "Saharsa", "Sasaram", "Hajipur", "Dehri", "Siwan", 
    "Motihari", "Nawada", "Bagaha", "Buxar", "Kishanganj", "Sitamarhi", "Jamalpur", "Jehanabad", "Aurangabad"
  ],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", 
    "Mahasamund", "Dhamtari", "Chirmiri", "Bhatapara", "Dalli-Rajhara", "Naila Janjgir", "Tilda Newra", 
    "Mungeli", "Manendragarh", "Sakti"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman", "Diu", "Silvassa", "Amli", "Naroli", "Dadra", "Sayli", "Khanvel"
  ],
  "Delhi": [
    "New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", 
    "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi", "Shahdara"
  ],
  "Goa": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", 
    "Cuncolim", "Quepem", "Sanguem", "Canacona", "Pernem", "Valpoi"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", 
    "Anand", "Nadiad", "Morbi", "Surendranagar", "Bharuch", "Mehsana", "Gandhidham", "Bhuj", "Patan", 
    "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra", "Porbandar", "Navsari", "Dahod"
  ],
  "Haryana": [
    "Chandigarh", "Faridabad", "Gurgaon", "Hisar", "Rohtak", "Panipat", "Karnal", "Sonipat", "Yamunanagar", 
    "Panchkula", "Bhiwani", "Bahadurgarh", "Jind", "Sirsa", "Thanesar", "Kaithal", "Rewari", "Palwal", 
    "Ambala", "Gohana", "Narnaul"
  ],
  "Himachal Pradesh": [
    "Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Palampur", "Baddi", "Nahan", "Hamirpur", 
    "Una", "Kangra", "Bilaspur", "Chamba", "Dalhousie", "Kasauli", "Keylong", "Rampur", "Arki", "Nalagarh"
  ],
  "Jammu and Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur", "Pulwama", "Rajouri", 
    "Punch", "Kupwara", "Bandipora", "Budgam", "Kulgam", "Ganderbal", "Shopian", "Samba", "Reasi"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", 
    "Phusro", "Adityapur", "Chas", "Gumla", "Chaibasa", "Dumka", "Sahibganj", "Godda", "Koderma", 
    "Chirkunda", "Mihijam"
  ],
  "Karnataka": [
    "Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum", "Gulbarga", "Shimoga", "Tumkur", "Bellary", 
    "Davangere", "Bijapur", "Raichur", "Udupi", "Hassan", "Mandya", "Chitradurga", "Bidar", "Hospet", 
    "Gadag-Betageri", "Karwar", "Bagalkot", "Chikmagalur", "Bhadravati", "Haveri", "Kolar"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Palakkad", "Alappuzha", 
    "Malappuram", "Kottayam", "Kasaragod", "Pathanamthitta", "Idukki", "Wayanad", "Ernakulam", "Thalassery", 
    "Perinthalmanna", "Tirur", "Vatakara", "Kanhangad", "Payyanur", "Koyilandy", "Mattanur"
  ],
  "Ladakh": ["Leh", "Kargil", "Drass", "Nubra", "Zanskar"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott", "Kalpeni", "Kadmat"],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", 
    "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", 
    "Chhatarpur", "Damoh", "Mandsaur", "Khargone", "Neemuch", "Pithampur", "Hoshangabad", "Itarsi"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", 
    "Nanded", "Sangli", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Jalgaon", "Bhiwandi", 
    "Navi Mumbai", "Kalyan-Dombivli", "Vasai-Virar", "Pimpri-Chinchwad", "Panvel", "Ulhasnagar", 
    "Malegaon", "Jalna", "Satara", "Ichalkaranji", "Parbhani"
  ],
  "Manipur": [
    "Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong", 
    "Jiribam", "Moreh", "Mayang Imphal"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara", "Williamnagar", "Nongpoh", "Resubelpara", 
    "Mairang", "Cherrapunji"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Mamit", "Lawngtlai", "Saiha", "Hnahthial", "Khawzawl"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Kiphire", "Longleng", "Peren"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Berhampur", "Balasore", "Baripada", 
    "Bhadrak", "Jharsuguda", "Jeypore", "Paradip", "Barbil", "Bargarh", "Rayagada", "Balangir", 
    "Kendujhar", "Angul", "Dhenkanal", "Jajpur", "Koraput"
  ],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Punjab": [
    "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", 
    "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Rajpura", 
    "Firozpur", "Kapurthala", "Sangrur", "Fazilka", "Rupnagar", "Barnala", "Faridkot", "Mansa"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Bhilwara", 
    "Sikar", "Pali", "Tonk", "Kishangarh", "Beawar", "Hanumangarh", "Ganganagar", "Jhunjhunu", "Churu", 
    "Barmer", "Sawai Madhopur", "Chittorgarh", "Nagaur", "Bundi", "Banswara", "Dungarpur", "Jaisalmer"
  ],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Jorethang", "Singtam", "Ravangla"],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", 
    "Thoothukudi", "Dindigul", "Thanjavur", "Tiruppur", "Kanchipuram", "Karur", "Nagercoil", "Cuddalore", 
    "Kumbakonam", "Hosur", "Rajapalayam", "Pudukkottai", "Pollachi", "Sivakasi", "Ambur", "Tiruvannamalai", 
    "Ooty", "Kanyakumari", "Villupuram", "Krishnagiri"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", 
    "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Jagtial", "Mancherial", "Nirmal", "Kothagudem", 
    "Bodhan", "Sangareddy", "Vikarabad", "Bhongir"
  ],
  "Tripura": [
    "Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Khowai", "Ambassa", "Teliamura", "Sabroom"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Noida", "Ghaziabad", "Bareilly", 
    "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", 
    "Rampur", "Shahjahanpur", "Farrukhabad", "Ayodhya", "Mau", "Hapur", "Etawah", "Mirzapur", "Bulandshahr", 
    "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli", "Orai", "Sitapur", "Bahraich", "Modinagar"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Nainital", "Rishikesh", "Kashipur", 
    "Pithoragarh", "Almora", "Pauri", "Tehri", "Champawat", "Bageshwar", "Rudraprayag", "Uttarkashi"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling", "Bardhaman", "Malda", "Baharampur", 
    "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", 
    "Nabadwip", "Medinipur", "Jalpaiguri", "Balurghat", "Basirhat", "Bankura", "Purulia", "Alipurduar"
  ],
};

type FormData = {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  card_number: string;
  exp_date: string;
  cvv: string;
};

interface User {
  id: string;
}

const CheckOutForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [user, setUser] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [allData, setAllData] = useState<any>({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    userId: "",
  });
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [pay, setPay] = useState<boolean>(false);
  const userId = session?.user ? (session.user as User).id : null;

  // Refs for click outside
  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const states = Object.keys(INDIAN_STATES_CITIES).sort();

  // Filter states based on search query
  const filteredStates = states.filter((state) =>
    state.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  // Filter cities based on search query
  const filteredCities = availableCities.filter((city) =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const totalAmount = queryParams.get("totalAmount");
    const shipping = queryParams.get("shipping");
    const id = queryParams.get("id");
    setTotalAmount(
      parseFloat(totalAmount as string) + parseFloat(shipping as string)
    );
    setUser(id as string);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle state selection and update cities
  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setStateSearchQuery(state);
    setValue("state", state);
    setIsStateDropdownOpen(false);
    
    if (state && INDIAN_STATES_CITIES[state]) {
      setAvailableCities(INDIAN_STATES_CITIES[state]);
      setSelectedCity("");
      setCitySearchQuery("");
      setValue("city", "");
    } else {
      setAvailableCities([]);
      setSelectedCity("");
      setCitySearchQuery("");
      setValue("city", "");
    }
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearchQuery(city);
    setValue("city", city);
    setIsCityDropdownOpen(false);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (userId) {
      setAllData({
        ...data,
        userId: userId,
      });
      setPay(true);

      reset();
    } else {
      toast({
        title: "Error",
        description: "Please login to place an order",
        duration: 3000,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const pathname = url.pathname;
    const searchParams = new URLSearchParams(url.search);

    if (pathname === "/checkout" && Array.from(searchParams).length === 0) {
      window.location.href = "/";
    }
  }, []);

  return (
    <>
      <div className="w-full py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-base text-gray-600">Complete your purchase</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      placeholder="Enter first name"
                      {...register("first_name", {
                        required: "First name is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                    {errors.first_name && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {errors.first_name.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      placeholder="Enter last name"
                      {...register("last_name", {
                        required: "Last name is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                    {errors.last_name && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {errors.last_name.message}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Street address, apartment, suite, etc."
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                {/* State Dropdown with Search */}
                <div className="mt-6 relative" ref={stateRef}>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    State
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search and select state"
                      value={stateSearchQuery}
                      onChange={(e) => {
                        setStateSearchQuery(e.target.value);
                        setIsStateDropdownOpen(true);
                        setIsCityDropdownOpen(false);
                      }}
                      onFocus={() => {
                        setIsStateDropdownOpen(true);
                        setIsCityDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                    />
                    <ChevronDown
                      onClick={() => {
                        setIsStateDropdownOpen(!isStateDropdownOpen);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform cursor-pointer ${
                        isStateDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                    <input
                      type="hidden"
                      {...register("state", { required: "State is required" })}
                      value={selectedState}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {isStateDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {filteredStates.length > 0 ? (
                          filteredStates.map((state) => (
                            <div
                              key={state}
                              onClick={() => handleStateSelect(state)}
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition ${
                                selectedState === state
                                  ? "bg-gray-900 text-white hover:bg-gray-800"
                                  : "text-gray-900"
                              }`}
                            >
                              {state}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-400 text-sm">
                            No states found
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {errors.state && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.state.message}
                    </span>
                  )}
                </div>

                {/* City Dropdown with Search */}
                <div className="mt-6 relative" ref={cityRef}>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={selectedState ? "Search and select city" : "Please select state first"}
                      value={citySearchQuery}
                      onChange={(e) => {
                        setCitySearchQuery(e.target.value);
                        setIsCityDropdownOpen(true);
                        setIsStateDropdownOpen(false);
                      }}
                      onFocus={() => {
                        if (selectedState) {
                          setIsCityDropdownOpen(true);
                          setIsStateDropdownOpen(false);
                        }
                      }}
                      disabled={!selectedState}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <ChevronDown
                      onClick={() => {
                        if (selectedState) {
                          setIsCityDropdownOpen(!isCityDropdownOpen);
                          setIsStateDropdownOpen(false);
                        }
                      }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
                        selectedState ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                      } ${isCityDropdownOpen ? "rotate-180" : ""}`}
                    />
                    <input
                      type="hidden"
                      {...register("city", { required: "City is required" })}
                      value={selectedCity}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {isCityDropdownOpen && selectedState && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <div
                              key={city}
                              onClick={() => handleCitySelect(city)}
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition ${
                                selectedCity === city
                                  ? "bg-gray-900 text-white hover:bg-gray-800"
                                  : "text-gray-900"
                              }`}
                            >
                              {city}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-400 text-sm">
                            No cities found
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {errors.city && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.city.message}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    placeholder="Enter ZIP code"
                    {...register("zip", { 
                      required: "ZIP code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Please enter a valid 6-digit PIN code"
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    maxLength={6}
                  />
                  {errors.zip && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.zip.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Total and Submit */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-lg font-semibold text-gray-900">
                    Total Amount:{" "}
                    <span className="text-xl font-bold">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {pay && <Checkout data={totalAmount} user={allData} />}
    </>
  );
};

export default CheckOutForm;
