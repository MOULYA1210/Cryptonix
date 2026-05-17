// server/controllers/toolController.js
import {
  generateHash,
  analyzePasswordStrength,
  generateSecurePassword,
} from '../utils/cryptoUtils.js';
import ToolHistory from '../models/ToolHistory.js';

// Helper: Save tool usage to history
const saveHistory = async (userId, toolName, action, metadata = {}) => {
  try {
    await ToolHistory.create({ user: userId, toolName, action, metadata });
  } catch {
    console.warn('Could not save tool history.');
  }
};

// ─── HASH GENERATOR ───────────────────────────────────
export const generateHashHandler = async (req, res) => {
  try {
    const { text, algorithm = 'sha256' } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required.' });
    }
    const hash = generateHash(text, algorithm);
    if (req.user) {
      await saveHistory(req.user._id, 'hash-generator', 'generate', { algorithm });
    }
    res.status(200).json({ success: true, hash, algorithm });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── PASSWORD ANALYZER ────────────────────────────────
export const analyzePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }
    const result = analyzePasswordStrength(password);
    if (req.user) {
      await saveHistory(req.user._id, 'password-analyzer', 'analyze', {
        strength: result.strength,
      });
    }
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PASSWORD GENERATOR ───────────────────────────────
export const generatePassword = async (req, res) => {
  try {
    const { length = 16, options = {} } = req.body;
    if (length < 4 || length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password length must be between 4 and 128.',
      });
    }
    const password = generateSecurePassword(length, options);
    if (req.user) {
      await saveHistory(req.user._id, 'password-generator', 'generate', { length });
    }
    res.status(200).json({ success: true, password });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SAVE TOOL USAGE (called from frontend) ───────────
export const saveToolUsage = async (req, res) => {
  try {
    const { toolName, action, metadata = {} } = req.body;

    if (!toolName || !action) {
      return res.status(400).json({
        success: false,
        message: 'toolName and action are required.',
      });
    }

    await ToolHistory.create({
      user: req.user._id,
      toolName,
      action,
      metadata,
    });

    res.status(201).json({ success: true, message: 'Usage saved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET TOOL HISTORY ─────────────────────────────────
export const getToolHistory = async (req, res) => {
  try {
    const history = await ToolHistory
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};