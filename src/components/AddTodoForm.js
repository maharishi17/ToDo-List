import React from 'react';
import { useForm } from 'react-hook-form';

const defaultCategories = ['work', 'personal', 'shopping', 'others'];

export default function AddTodoForm({ onAdd }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const submit = async data => {
    await onAdd({ title: data.title.trim(), category: data.category || 'others', due: data.due || null });
    reset();
  };

  return (
    <form className="add-form" onSubmit={handleSubmit(submit)}>
      <input style={{ borderRadius: "20px", padding: "10px"  }}  id="newTodoTitle" placeholder="Enter the Notes..." {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Min 2 chars' } })} />
      <select {...register('category')}>
        {defaultCategories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input type="date" {...register('due')} />
      <button type="submit" disabled={isSubmitting}>Add</button>
      <div className="errors">{errors.title && <span>{errors.title.message}</span>}</div>
    </form>
  );
}
