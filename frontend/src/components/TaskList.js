import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import TaskItem from './TaskItem.js';
import '../styles/TaskList.css';

const SPEED_PX_PER_SEC = 45;
const DRAG_THRESHOLD = 6;

function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const firstSetRef = useRef(null);

  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragLastXRef = useRef(0);
  const dragMovedRef = useRef(false);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  const [copies, setCopies] = useState(2);

  const hasTasks = tasks.length > 0;

  useLayoutEffect(() => {
    if (!hasTasks) return;

    const measure = () => {
      const set = firstSetRef.current;
      const container = containerRef.current;
      if (!set || !container) return;

      const setWidth = set.getBoundingClientRect().width;
      setWidthRef.current = setWidth;

      if (setWidth > 0) {
        const needed = Math.max(2, Math.ceil(container.clientWidth / setWidth) + 1);
        setCopies((prev) => (prev !== needed ? needed : prev));
        offsetRef.current = ((offsetRef.current % setWidth) + setWidth) % setWidth;
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [tasks, copies, hasTasks]);

  useEffect(() => {
    if (!hasTasks) return undefined;

    const step = (time) => {
      const last = lastTimeRef.current || time;
      const dt = (time - last) / 1000;
      lastTimeRef.current = time;

      const setWidth = setWidthRef.current;
      if (!pausedRef.current && !draggingRef.current && setWidth > 0) {
        offsetRef.current += SPEED_PX_PER_SEC * dt;
        if (offsetRef.current >= setWidth) offsetRef.current -= setWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [hasTasks]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const handlePointerDown = (event) => {
    draggingRef.current = true;
    dragMovedRef.current = false;
    dragStartXRef.current = event.clientX;
    dragLastXRef.current = event.clientX;
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    const setWidth = setWidthRef.current;
    if (setWidth <= 0) return;

    const delta = event.clientX - dragLastXRef.current;
    dragLastXRef.current = event.clientX;

    if (Math.abs(event.clientX - dragStartXRef.current) > DRAG_THRESHOLD) {
      dragMovedRef.current = true;
    }

    let next = offsetRef.current - delta;
    next = ((next % setWidth) + setWidth) % setWidth;
    offsetRef.current = next;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-next}px, 0, 0)`;
    }
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  const handleClickCapture = (event) => {
    if (dragMovedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      dragMovedRef.current = false;
    }
  };

  if (!hasTasks) {
    return (
      <div className="carousel carousel--empty">
        <p className="carousel__empty-title">No tasks to show</p>
        <p className="carousel__empty-hint">
          Add a task above, or change the filter to see more.
        </p>
      </div>
    );
  }

  const groups = Array.from({ length: copies });

  return (
    <div
      className="carousel"
      ref={containerRef}
      onMouseEnter={pause}
      onMouseLeave={() => {
        resume();
        endDrag();
      }}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onClickCapture={handleClickCapture}
    >
      <div className="carousel__track" ref={trackRef}>
        {groups.map((_, copyIndex) => (
          <div
            className="carousel__group"
            key={copyIndex}
            ref={copyIndex === 0 ? firstSetRef : undefined}
            aria-hidden={copyIndex === 0 ? undefined : true}
          >
            {tasks.map((task) => (
              <TaskItem
                key={`${copyIndex}-${task.id}`}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
