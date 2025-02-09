// App.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// ------------------- Firebase Initialization -------------------
const firebaseConfig = {
  apiKey: "AIzaSyDmxK3NbE63nFj5j9Hh0tRNer7iqEg3gBs",
  authDomain: "jobportal-29638.firebaseapp.com",
  projectId: "jobportal-29638",
  storageBucket: "jobportal-29638.firebasestorage.app",
  messagingSenderId: "845772030537",
  appId: "1:845772030537:web:31180aa920f52285483598",
  measurementId: "G-HJMLNN835C"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ------------------- Language Context & Translations -------------------
const LanguageContext = createContext();

const translations = {
  en: {
    selectLanguage: "Please select your language",
    english: "English",
    telugu: "Telugu",
    hindi: "Hindi",
    jobProviders: "Job Providers",
    jobFinders: "Job Finders",
    providerVoice: "Want to provide job",
    finderVoice: "You want to find job",
    login: "Login",
    signup: "Sign Up",
    providerSignupInstruction: "Please sign up",
    providerLoginInstruction: "Please open your registered account",
    addJob: "Add Job",
    addJobVoice: "Add the job you want",
    businessName: "Business Name",
    jobCategory: "Job Category",
    jobLocation: "Job Location",
    salaryRange: "Salary Range",
    jobRequirements: "Job Requirements",
    jobType: "Job Type",
    partTime: "Part Time",
    fullTime: "Full Time",
    postJob: "Post Job",
    profile: "Profile",
    logout: "Logout",
    updateProfile: "Update Profile",
    finderSignupInstruction: "Please sign up",
    finderLoginInstruction: "Please open your registered account",
    search: "Search",
    apply: "Apply",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    uploadPhoto: "Upload Photo",
    uploadAadhar: "Upload Aadhar Photo",
    uploadBusinessPhoto: "Upload Shop/Business Photo",
    uploadLicense: "Upload Shop/Business License Photo",
    name: "Name",
    phone: "Phone Number",
    address: "Address",
    password: "Password",
    age: "Age",
    userPhoto: "Upload User Photo",
    aadharPhoto: "Upload Aadhar Photo",
    uploadDocument: "Upload Document",
  },
  te: {
    selectLanguage: "దయచేసి మీ భాషను ఎంచుకోండి",
    english: "ఆంగ్లం",
    telugu: "తెలుగు",
    hindi: "హిందీ",
    jobProviders: "జాబ్ ప్రొవైడర్స్",
    jobFinders: "జాబ్ ఫైండర్స్",
    providerVoice: "ఉద్యోగం అందించాలనుకుంటున్నారా",
    finderVoice: "ఉద్యోగం కోసం చూడటానికి",
    login: "లాగిన్",
    signup: "సైన్ అప్",
    providerSignupInstruction: "దయచేసి సైన్ అప్ చేయండి",
    providerLoginInstruction: "దయచేసి మీ నమోదు ఖాతాను తెరవండి",
    addJob: "ఉద్యోగం జోడించండి",
    addJobVoice: "మీరు కోరుకునే ఉద్యోగాన్ని జోడించండి",
    businessName: "వ్యాపార పేరు",
    jobCategory: "ఉద్యోగం వర్గం",
    jobLocation: "ఉద్యోగం ప్రదేశం",
    salaryRange: "జీత శ్రేణి",
    jobRequirements: "ఉద్యోగం అవసరాలు",
    jobType: "ఉద్యోగం రకం",
    partTime: "పార్ట్ టైమ్",
    fullTime: "ఫుల్ టైమ్",
    postJob: "ఉద్యోగాన్ని పోస్ట్ చేయండి",
    profile: "ప్రొఫైల్",
    logout: "లాగ్ అవుట్",
    updateProfile: "ప్రొఫైల్ నవీకరణ",
    finderSignupInstruction: "దయచేసి సైన్ అప్ చేయండి",
    finderLoginInstruction: "దయచేసి మీ నమోదు ఖాతాను తెరవండి",
    search: "సెర్చ్",
    apply: "అప్లై",
    pending: "పెండింగ్",
    accepted: "ఆంగీకరించబడింది",
    rejected: "నిరసించబడింది",
    uploadPhoto: "ఫోటో అప్లోడ్ చేయండి",
    uploadAadhar: "ఆధార్ ఫోటో అప్లోడ్ చేయండి",
    uploadBusinessPhoto: "షాప్/వ్యాపార ఫోటో అప్లోడ్ చేయండి",
    uploadLicense: "షాప్/వ్యాపార లైసెన్స్ అప్లోడ్ చేయండి",
    name: "పేరు",
    phone: "ఫోన్ నంబర్",
    address: "చిరునామా",
    password: "పాస్వర్డ్",
    age: "వయసు",
    userPhoto: "యూజర్ ఫోటో అప్లోడ్ చేయండి",
    aadharPhoto: "ఆధార్ ఫోటో అప్లోడ్ చేయండి",
    uploadDocument: "డాక్యుమెంట్ అప్లోడ్ చేయండి",
  },
  hi: {
    selectLanguage: "कृपया अपनी भाषा चुनें",
    english: "अंग्रेज़ी",
    telugu: "तेलुगु",
    hindi: "हिन्दी",
    jobProviders: "नौकरी प्रदाता",
    jobFinders: "नौकरी खोजने वाले",
    providerVoice: "क्या आप नौकरी प्रदान करना चाहते हैं",
    finderVoice: "क्या आप नौकरी ढूंढना चाहते हैं",
    login: "लॉगिन",
    signup: "साइन अप",
    providerSignupInstruction: "कृपया साइन अप करें",
    providerLoginInstruction: "कृपया अपना पंजीकृत खाता खोलें",
    addJob: "नौकरी जोड़ें",
    addJobVoice: "आप जो नौकरी चाहते हैं, जोड़ें",
    businessName: "व्यापार का नाम",
    jobCategory: "नौकरी श्रेणी",
    jobLocation: "नौकरी स्थान",
    salaryRange: "वेतन सीमा",
    jobRequirements: "नौकरी आवश्यकताएं",
    jobType: "नौकरी का प्रकार",
    partTime: "आंशिककालिक",
    fullTime: "पूर्णकालिक",
    postJob: "नौकरी पोस्ट करें",
    profile: "प्रोफ़ाइल",
    logout: "लॉगआउट",
    updateProfile: "प्रोफ़ाइल अपडेट करें",
    finderSignupInstruction: "कृपया साइन अप करें",
    finderLoginInstruction: "कृपया अपना पंजीकृत खाता खोलें",
    search: "खोजें",
    apply: "लागू करें",
    pending: "लंबित",
    accepted: "स्वीकृत",
    rejected: "अस्वीकृत",
    uploadPhoto: "फोटो अपलोड करें",
    uploadAadhar: "आधार फोटो अपलोड करें",
    uploadBusinessPhoto: "दुकान/व्यापार फोटो अपलोड करें",
    uploadLicense: "दुकान/व्यापार लाइसेंस अपलोड करें",
    name: "नाम",
    phone: "फ़ोन नंबर",
    address: "पता",
    password: "पासवर्ड",
    age: "उम्र",
    userPhoto: "उपयोगकर्ता फोटो अपलोड करें",
    aadharPhoto: "आधार फोटो अपलोड करें",
    uploadDocument: "दस्तावेज़ अपलोड करें",
  }
};

const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  return (key) =>
    translations[language] && translations[language][key]
      ? translations[language][key]
      : key;
};

// ------------------- Text-To-Speech Helper -------------------
const speak = (text, lang) => {
  let languageCode = 'en-US';
  if (lang === 'te') languageCode = 'te-IN';
  else if (lang === 'hi') languageCode = 'hi-IN';
  Speech.speak(text, { language: languageCode });
};

// ------------------- Helper: Upload Image to Firebase Storage -------------------
const uploadImageAsync = async (uri, folder, fileName) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase.storage().ref().child(`${folder}/${fileName}`);
  await ref.put(blob);
  return await ref.getDownloadURL();
};

// ------------------- Screen: Language Selection -------------------
const LanguageSelectionScreen = ({ navigation }) => {
  const { setLanguage } = useContext(LanguageContext);
  const t = useTranslation();

  const chooseLanguage = (lang) => {
    speak(t('selectLanguage'), lang);
    setLanguage(lang);
    navigation.navigate('RoleSelection');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('selectLanguage')}</Text>
      <TouchableOpacity style={styles.button} onPress={() => chooseLanguage('en')}>
        <Text style={styles.buttonText}>{t('english')}</Text>
        <Text style={styles.speaker}>🔊</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => chooseLanguage('te')}>
        <Text style={styles.buttonText}>{t('telugu')}</Text>
        <Text style={styles.speaker}>🔊</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => chooseLanguage('hi')}>
        <Text style={styles.buttonText}>{t('hindi')}</Text>
        <Text style={styles.speaker}>🔊</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------- Screen: Role Selection -------------------
const RoleSelectionScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProviderAuth')}>
          <Text style={styles.cardTitle}>{t('jobProviders')}</Text>
          <TouchableOpacity style={styles.speakerButton} onPress={() => speak(t('providerVoice'), language)}>
            <Text style={styles.speaker}>🔊</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('FinderAuth')}>
          <Text style={styles.cardTitle}>{t('jobFinders')}</Text>
          <TouchableOpacity style={styles.speakerButton} onPress={() => speak(t('finderVoice'), language)}>
            <Text style={styles.speaker}>🔊</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ------------------- Screen: Provider Authentication -------------------
const ProviderAuthScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    password: '',
    photo: null,
    aadhar: null,
    businessPhoto: null,
    license: null,
  });
  const [error, setError] = useState('');

  const pickImage = async (field) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.cancelled) {
      setFormData({ ...formData, [field]: result.uri });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const email = formData.phone + '@provider.com';
        await firebase.auth().signInWithEmailAndPassword(email, formData.password);
        navigation.navigate('ProviderMain');
      } else {
        const email = formData.phone + '@provider.com';
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, formData.password);
        const uid = userCredential.user.uid;
        // Upload images if selected
        const uploadFile = async (uri, folder) => {
          if (!uri) return '';
          const fileName = uid + '_' + uri.substring(uri.lastIndexOf('/') + 1);
          return await uploadImageAsync(uri, folder, fileName);
        };
        const photoURL = await uploadFile(formData.photo, 'provider_photos');
        const aadharURL = await uploadFile(formData.aadhar, 'provider_aadhar');
        const businessPhotoURL = await uploadFile(formData.businessPhoto, 'provider_businessPhotos');
        const licenseURL = await uploadFile(formData.license, 'provider_licenses');

        await firebase.firestore().collection('providers').doc(uid).set({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          photoURL,
          aadharURL,
          businessPhotoURL,
          licenseURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        navigation.navigate('ProviderMain');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authToggle}>
        <TouchableOpacity onPress={() => setIsLogin(true)} style={[styles.toggleButton, isLogin && styles.activeToggle]}>
          <Text style={styles.toggleText}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(false)} style={[styles.toggleButton, !isLogin && styles.activeToggle]}>
          <Text style={styles.toggleText}>{t('signup')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.authInstruction}>
        <Text>{isLogin ? t('providerLoginInstruction') : t('providerSignupInstruction')}</Text>
        <TouchableOpacity onPress={() => speak(isLogin ? t('providerLoginInstruction') : t('providerSignupInstruction'), language)}>
          <Text style={styles.speaker}>🔊</Text>
        </TouchableOpacity>
      </View>
      {!isLogin && (
        <>
          <TextInput
            placeholder={t('name')}
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          <TextInput
            placeholder={t('address')}
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
          />
        </>
      )}
      <TextInput
        placeholder={t('phone')}
        style={styles.input}
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder={t('password')}
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
      {!isLogin && (
        <>
          <Button title={t('uploadPhoto')} onPress={() => pickImage('photo')} />
          {formData.photo && <Image source={{ uri: formData.photo }} style={styles.imagePreview} />}
          <Button title={t('uploadAadhar')} onPress={() => pickImage('aadhar')} />
          {formData.aadhar && <Image source={{ uri: formData.aadhar }} style={styles.imagePreview} />}
          <Button title={t('uploadBusinessPhoto')} onPress={() => pickImage('businessPhoto')} />
          {formData.businessPhoto && <Image source={{ uri: formData.businessPhoto }} style={styles.imagePreview} />}
          <Button title={t('uploadLicense')} onPress={() => pickImage('license')} />
          {formData.license && <Image source={{ uri: formData.license }} style={styles.imagePreview} />}
        </>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{isLogin ? t('login') : t('signup')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ------------------- Screen: Provider Main -------------------
const ProviderMainScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = useTranslation();

  const handleLogout = async () => {
    await firebase.auth().signOut();
    navigation.navigate('RoleSelection');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('jobProviders')}</Text>
        <View style={styles.headerButtons}>
          <Button title={t('profile')} onPress={() => navigation.navigate('ProviderProfile')} />
          <Button title={t('logout')} onPress={handleLogout} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.addJobButton}
        onPress={() => {
          speak(t('addJobVoice'), language);
          navigation.navigate('ProviderAddJob');
        }}
      >
        <Text style={styles.addJobButtonText}>{t('addJob')}</Text>
      </TouchableOpacity>
      {/* Optionally, list posted jobs here */}
    </View>
  );
};

// ------------------- Screen: Provider Add Job -------------------
const ProviderAddJobScreen = ({ navigation }) => {
  const t = useTranslation();
  const [formData, setFormData] = useState({
    businessName: '',
    jobCategory: '',
    jobLocation: '',
    salaryRange: '',
    jobRequirements: '',
    jobType: 'fullTime'
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('jobs').add({
        ...formData,
        providerId: uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('addJob')}</Text>
      <TextInput
        placeholder={t('businessName')}
        style={styles.input}
        value={formData.businessName}
        onChangeText={(text) => handleChange('businessName', text)}
      />
      <TextInput
        placeholder={t('jobCategory')}
        style={styles.input}
        value={formData.jobCategory}
        onChangeText={(text) => handleChange('jobCategory', text)}
      />
      <TextInput
        placeholder={t('jobLocation')}
        style={styles.input}
        value={formData.jobLocation}
        onChangeText={(text) => handleChange('jobLocation', text)}
      />
      <TextInput
        placeholder={t('salaryRange')}
        style={styles.input}
        value={formData.salaryRange}
        onChangeText={(text) => handleChange('salaryRange', text)}
      />
      <TextInput
        placeholder={t('jobRequirements')}
        style={styles.input}
        value={formData.jobRequirements}
        onChangeText={(text) => handleChange('jobRequirements', text)}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>{t('jobType')}: </Text>
        <TouchableOpacity onPress={() => handleChange('jobType', 'partTime')}>
          <Text style={{ marginHorizontal: 10 }}>{t('partTime')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChange('jobType', 'fullTime')}>
          <Text style={{ marginHorizontal: 10 }}>{t('fullTime')}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{t('postJob')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ------------------- Screen: Provider Profile -------------------
const ProviderProfileScreen = ({ navigation }) => {
  const t = useTranslation();
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('providers')
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setProfile({ name: data.name, phone: data.phone });
        }
      });
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('providers').doc(uid).update(profile);
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('updateProfile')}</Text>
      <TextInput
        placeholder={t('name')}
        style={styles.input}
        value={profile.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        placeholder={t('phone')}
        style={styles.input}
        value={profile.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitButtonText}>{t('updateProfile')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------- Screen: Finder Authentication -------------------
const FinderAuthScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    password: '',
    userPhoto: null,
    aadhar: null,
  });
  const [error, setError] = useState('');

  const pickImage = async (field) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.cancelled) {
      setFormData({ ...formData, [field]: result.uri });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const email = formData.phone + '@finder.com';
        await firebase.auth().signInWithEmailAndPassword(email, formData.password);
        navigation.navigate('FinderMain');
      } else {
        const email = formData.phone + '@finder.com';
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, formData.password);
        const uid = userCredential.user.uid;
        const uploadFile = async (uri, folder) => {
          if (!uri) return '';
          const fileName = uid + '_' + uri.substring(uri.lastIndexOf('/') + 1);
          return await uploadImageAsync(uri, folder, fileName);
        };
        const userPhotoURL = await uploadFile(formData.userPhoto, 'finder_photos');
        const aadharURL = await uploadFile(formData.aadhar, 'finder_aadhar');
        await firebase.firestore().collection('finders').doc(uid).set({
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
          userPhotoURL,
          aadharURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        navigation.navigate('FinderMain');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authToggle}>
        <TouchableOpacity onPress={() => setIsLogin(true)} style={[styles.toggleButton, isLogin && styles.activeToggle]}>
          <Text style={styles.toggleText}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(false)} style={[styles.toggleButton, !isLogin && styles.activeToggle]}>
          <Text style={styles.toggleText}>{t('signup')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.authInstruction}>
        <Text>{isLogin ? t('finderLoginInstruction') : t('finderSignupInstruction')}</Text>
        <TouchableOpacity onPress={() => speak(isLogin ? t('finderLoginInstruction') : t('finderSignupInstruction'), language)}>
          <Text style={styles.speaker}>🔊</Text>
        </TouchableOpacity>
      </View>
      {!isLogin && (
        <>
          <TextInput
            placeholder={t('name')}
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          <TextInput
            placeholder={t('age')}
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => handleChange('age', text)}
            keyboardType="numeric"
          />
        </>
      )}
      <TextInput
        placeholder={t('phone')}
        style={styles.input}
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder={t('password')}
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
      {!isLogin && (
        <>
          <Button title={t('userPhoto')} onPress={() => pickImage('userPhoto')} />
          {formData.userPhoto && <Image source={{ uri: formData.userPhoto }} style={styles.imagePreview} />}
          <Button title={t('aadharPhoto')} onPress={() => pickImage('aadhar')} />
          {formData.aadhar && <Image source={{ uri: formData.aadhar }} style={styles.imagePreview} />}
        </>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{isLogin ? t('login') : t('signup')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ------------------- Screen: Finder Main -------------------
const FinderMainScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const t = useTranslation();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('jobs')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const jobsData = [];
        snapshot.forEach((doc) => {
          jobsData.push({ id: doc.id, ...doc.data() });
        });
        setJobs(jobsData);
      });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await firebase.auth().signOut();
    navigation.navigate('RoleSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TextInput placeholder={t('search')} style={styles.searchInput} />
        <View style={styles.headerButtons}>
          <Button title={t('profile')} onPress={() => navigation.navigate('FinderProfile')} />
          <Button title={t('logout')} onPress={handleLogout} />
        </View>
      </View>
      {jobs.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <Text style={styles.jobTitle}>{job.businessName}</Text>
          <Text>
            {job.jobCategory} - {job.jobLocation}
          </Text>
          <Text>
            {t('salaryRange')}: {job.salaryRange}
          </Text>
          <Text>{job.jobRequirements}</Text>
          <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate('FinderApply', { jobId: job.id })}>
            <Text style={styles.applyButtonText}>{t('apply')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

// ------------------- Screen: Finder Profile -------------------
const FinderProfileScreen = ({ navigation }) => {
  const t = useTranslation();
  const [profile, setProfile] = useState({ name: '', age: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('finders')
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setProfile({ name: data.name, age: data.age, phone: data.phone });
        }
      });
  }, []);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const uid = firebase.auth().currentUser.uid;
      await firebase.firestore().collection('finders').doc(uid).update(profile);
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('updateProfile')}</Text>
      <TextInput placeholder={t('name')} style={styles.input} value={profile.name} onChangeText={(text) => handleChange('name', text)} />
      <TextInput
        placeholder={t('age')}
        style={styles.input}
        value={profile.age}
        onChangeText={(text) => handleChange('age', text)}
        keyboardType="numeric"
      />
      <TextInput
        placeholder={t('phone')}
        style={styles.input}
        value={profile.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitButtonText}>{t('updateProfile')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------- Screen: Finder Apply -------------------
const FinderApplyScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const t = useTranslation();
  const [documentUri, setDocumentUri] = useState(null);
  const [error, setError] = useState('');

  const pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.5,
    });
    if (!result.cancelled) {
      setDocumentUri(result.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const uid = firebase.auth().currentUser.uid;
      const fileName = uid + '' + jobId + '' + documentUri.substring(documentUri.lastIndexOf('/') + 1);
      const documentURL = await uploadImageAsync(documentUri, 'applications', fileName);
      await firebase.firestore().collection('applications').add({
        finderId: uid,
        jobId,
        documentURL,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      navigation.navigate('FinderMain');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('apply')}</Text>
      <Button title={t('uploadDocument')} onPress={pickDocument} />
      {documentUri && <Image source={{ uri: documentUri }} style={styles.imagePreview} />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{t('apply')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------- Navigation Setup -------------------
const Stack = createNativeStackNavigator();

export default function App() {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LanguageSelection">
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProviderAuth" component={ProviderAuthScreen} options={{ title: "Provider Auth" }} />
          <Stack.Screen name="ProviderMain" component={ProviderMainScreen} options={{ title: "Provider Main" }} />
          <Stack.Screen name="ProviderAddJob" component={ProviderAddJobScreen} options={{ title: "Add Job" }} />
          <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ title: "Profile" }} />
          <Stack.Screen name="FinderAuth" component={FinderAuthScreen} options={{ title: "Finder Auth" }} />
          <Stack.Screen name="FinderMain" component={FinderMainScreen} options={{ title: "Finder Main" }} />
          <Stack.Screen name="FinderProfile" component={FinderProfileScreen} options={{ title: "Profile" }} />
          <Stack.Screen name="FinderApply" component={FinderApplyScreen} options={{ title: "Apply Job" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageContext.Provider>
  );
}

// ------------------- Basic Styles -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
    justifyContent: 'space-between'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  speaker: {
    fontSize: 24,
    color: '#fff'
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  card: {
    backgroundColor: '#bbdefb',
    width: '40%',
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  speakerButton: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  authToggle: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%'
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center'
  },
  activeToggle: {
    backgroundColor: '#2196F3'
  },
  toggleText: {
    color: '#fff'
  },
  authInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10
  },
  errorText: {
    color: 'red'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerButtons: {
    flexDirection: 'row'
  },
  addJobButton: {
    backgroundColor: '#ff9800',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    width: '80%',
    alignItems: 'center'
  },
  addJobButtonText: {
    color: '#fff',
    fontSize: 18
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '60%'
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  applyButton: {
    backgroundColor: '#8bc34a',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  applyButtonText: {
    color: '#fff'
  }
});