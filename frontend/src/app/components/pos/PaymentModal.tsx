"use client";

import React, { useState } from 'react';
import { Printer } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export default function PaymentModal({ isOpen, onClose, totalAmount }: PaymentModalProps) {
  const [cashAmount, setCashAmount] = useState('0.00');
  const [cardAmount, setCardAmount] = useState('0.00');
  const [transferAmount, setTransferAmount] = useState('0.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  if (!isOpen) return null;

  const totalPaid = parseFloat(cashAmount || '0') + parseFloat(cardAmount || '0') + parseFloat(transferAmount || '0');
  const change = totalPaid - totalAmount;

  const handleConfirm = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TODO: Handle actual payment confirmation logic
    console.log('Payment confirmed:', { cashAmount, cardAmount, transferAmount, totalPaid, change });

    setIsProcessing(false);
    setIsApproved(true);
    // Don't close modal - wait for user to click Save or Print
  };

  const handlePrint = () => {
    // TODO: Handle print receipt logic
    console.log('Printing receipt...');
    // Reset states and close modal
    resetAndClose();
  };

  const handleSave = () => {
    // TODO: Handle save transaction logic
    console.log('Saving transaction...');
    // Reset states and close modal
    resetAndClose();
  };

  const resetAndClose = () => {
    setCashAmount('0.00');
    setCardAmount('0.00');
    setTransferAmount('0.00');
    setIsProcessing(false);
    setIsApproved(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-sm">
        {/* Total Display */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-gray-700 font-semibold text-lg">Total :</label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={change.toFixed(2)}
              readOnly
              className="flex-1 bg-blue-200 text-gray-800 font-bold text-center px-4 py-2 rounded-lg border-2 border-blue-300"
            />
            <div className="bg-blue-200 border-2 border-blue-300 px-3 py-2 rounded-lg">
              <span className="text-gray-700 font-bold">N</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {/* Cash */}
          <div className="flex items-center gap-3">
            <button className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-semibold px-6 py-2 rounded-lg border-2 border-blue-300 w-28">
              Cash
            </button>
            <input
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              disabled={isApproved}
              className="flex-1 bg-blue-200 text-gray-800 font-semibold text-center px-4 py-2 rounded-lg border-2 border-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Card */}
          <div className="flex items-center gap-3">
            <button className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-semibold px-6 py-2 rounded-lg border-2 border-blue-300 w-28">
              Card
            </button>
            <input
              type="number"
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value)}
              disabled={isApproved}
              className="flex-1 bg-blue-200 text-gray-800 font-semibold text-center px-4 py-2 rounded-lg border-2 border-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Transfer */}
          <div className="flex items-center gap-3">
            <button className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-semibold px-6 py-2 rounded-lg border-2 border-blue-300 w-28">
              Transfer
            </button>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              disabled={isApproved}
              className="flex-1 bg-blue-200 text-gray-800 font-semibold text-center px-4 py-2 rounded-lg border-2 border-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={isProcessing || isApproved}
          className="w-full bg-green-400 hover:bg-green-500 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg mb-4 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span className="text-2xl">• • •</span>
          ) : isApproved ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span>Payment Confirmed</span>
          )}
        </button>

        {/* Print and Save Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
