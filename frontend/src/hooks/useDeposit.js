import { useState, useEffect, useCallback } from "react";

const DEPOSIT_KEY = "user_deposit_balance";
const INITIAL_DEPOSIT = 500; // Initial deposit amount: 500 (in your currency)

export function useDeposit() {
  const [deposit, setDeposit] = useState(INITIAL_DEPOSIT);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize deposit from localStorage
  useEffect(() => {
    const storedDeposit = localStorage.getItem(DEPOSIT_KEY);
    if (storedDeposit !== null) {
      const parsedDeposit = parseFloat(storedDeposit);
      setDeposit(parsedDeposit);
    } else {
      localStorage.setItem(DEPOSIT_KEY, INITIAL_DEPOSIT.toString());
      setDeposit(INITIAL_DEPOSIT);
    }
    setIsLoading(false);
  }, []);

  // Deduct from deposit - read current value from localStorage
  const deductFromDeposit = useCallback((amount) => {
    const currentDeposit = parseFloat(localStorage.getItem(DEPOSIT_KEY) || INITIAL_DEPOSIT);
    const newDeposit = currentDeposit - amount;
    
    if (newDeposit < 0) {
      return {
        success: false,
        message: `Insufficient deposit. Required: ${amount}, Available: ${currentDeposit}`,
        remainingDeposit: currentDeposit,
      };
    }
    
    setDeposit(newDeposit);
    localStorage.setItem(DEPOSIT_KEY, newDeposit.toString());
    // Dispatch event to update deposit display across app
    window.dispatchEvent(new Event("deposit-updated"));
    
    return {
      success: true,
      message: "Amount deducted successfully",
      remainingDeposit: newDeposit,
    };
  }, []);

  // Add to deposit - read current value from localStorage
  const addToDeposit = useCallback((amount) => {
    const currentDeposit = parseFloat(localStorage.getItem(DEPOSIT_KEY) || INITIAL_DEPOSIT);
    const newDeposit = currentDeposit + amount;
    
    setDeposit(newDeposit);
    localStorage.setItem(DEPOSIT_KEY, newDeposit.toString());
    // Dispatch event to update deposit display across app
    window.dispatchEvent(new Event("deposit-updated"));
    
    return {
      success: true,
      remainingDeposit: newDeposit,
    };
  }, []);

  // Reset deposit (for testing)
  const resetDeposit = useCallback(() => {
    setDeposit(INITIAL_DEPOSIT);
    localStorage.setItem(DEPOSIT_KEY, INITIAL_DEPOSIT.toString());
  }, []);

  return {
    deposit,
    isLoading,
    deductFromDeposit,
    addToDeposit,
    resetDeposit,
  };
}
