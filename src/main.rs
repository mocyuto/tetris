extern crate sdl2;

use rand::Rng;
use sdl2::event::Event;
use sdl2::keyboard::Keycode;
use sdl2::pixels::Color;
use sdl2::rect::Rect;
use sdl2::render::{TextureQuery, WindowCanvas};
use std::time::{Duration, Instant};

type Tetrimino = Vec<Vec<u8>>;

struct Game {
    tetriminoes: Vec<Tetrimino>,
}

struct StackMino {
    mino: Tetrimino,
    x: i32,
    y: i32,
}

impl Game {
    fn new() -> Game {
        let tetriminoes = vec![
            vec![
                vec![1, 1, 0, 0],
                vec![1, 1, 0, 0],
                vec![0, 0, 0, 0],
                vec![0, 0, 0, 0],
            ],
            vec![
                vec![1, 0, 0, 0],
                vec![1, 0, 0, 0],
                vec![1, 1, 0, 0],
                vec![0, 0, 0, 0],
            ],
            vec![
                vec![1, 0, 0, 0],
                vec![1, 0, 0, 0],
                vec![1, 0, 0, 0],
                vec![1, 0, 0, 0],
            ],
            vec![
                vec![1, 0, 0, 0],
                vec![1, 1, 0, 0],
                vec![0, 1, 0, 0],
                vec![0, 0, 0, 0],
            ],
        ];
        Game { tetriminoes }
    }
}

const WIDTH: u32 = 800;
const HEIGHT: u32 = 600;
const BLOCK_SIZE: u32 = 24;
const STAGE_WIDTH: u32 = BLOCK_SIZE * 10;
const STAGE_HEIGHT: u32 = BLOCK_SIZE * 20;
const STAGE_X: i32 = ((WIDTH - STAGE_WIDTH) / 2) as i32;
const STAGE_Y: i32 = ((HEIGHT - STAGE_HEIGHT) / 2) as i32;
const FRAME_RATE: u32 = 60;

pub fn main() {
    let frame_duration: Duration = Duration::new(0, 1_000_000_000u32 / FRAME_RATE);
    let game = Game::new();

    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();
    let ttf_context = sdl2::ttf::init().unwrap();

    let window = video_subsystem
        .window("Rust Tetris", 800, 600)
        .position_centered()
        .build()
        .unwrap();

    let mut canvas = window.into_canvas().build().unwrap();
    let texture_creator = canvas.texture_creator();
    let font = ttf_context.load_font("assets/Mplus1-Bold.ttf", 32).unwrap();
    let surface = font.render("Rust TETRIS").blended(Color::WHITE).unwrap();
    let title_texture = texture_creator
        .create_texture_from_surface(&surface)
        .unwrap();
    let TextureQuery {
        width: title_width,
        height: title_height,
        ..
    } = title_texture.query();

    let mut event_pump = sdl_context.event_pump().unwrap();
    let mut rng = rand::thread_rng();
    let mut index: usize = rng.gen::<usize>() % 4 as usize;

    let mut position_x: i32 = STAGE_X;
    let mut position_y: i32 = STAGE_Y;
    let mut counter = 0;
    let mut rotate_count = 0;
    let mut is_rotate = false;
    let mut stack_minos: Vec<StackMino> = vec![];

    'running: loop {
        let start = Instant::now();
        for event in event_pump.poll_iter() {
            match event {
                Event::Quit { .. } => break 'running,
                Event::KeyDown {
                    keycode: Some(keycode),
                    ..
                } => match keycode {
                    Keycode::Escape => {
                        break 'running;
                    }
                    Keycode::Right => {
                        let next_pos = position_x + BLOCK_SIZE as i32;
                        if position_x < STAGE_X + STAGE_WIDTH as i32 {
                            position_x = next_pos;
                        }
                    }
                    Keycode::Left => {
                        let next_pos = position_x - BLOCK_SIZE as i32;
                        if position_x > STAGE_X {
                            position_x = next_pos;
                        }
                    }
                    Keycode::Up => {
                        rotate_count += 1;
                        if rotate_count > 4 {
                            rotate_count = 0;
                        }
                        is_rotate = !is_rotate;
                    }
                    Keycode::Down => {
                        position_y += BLOCK_SIZE as i32;
                    }
                    _ => {}
                },
                _ => {}
            }
        }

        canvas.set_draw_color(Color::BLACK);
        canvas.clear();
        canvas
            .copy(
                &title_texture,
                None,
                Some(Rect::new(20, 10, title_width, title_height)),
            )
            .unwrap();

        canvas.set_draw_color(Color::BLUE);
        canvas
            .draw_rect(Rect::new(STAGE_X, STAGE_Y, STAGE_WIDTH, STAGE_HEIGHT))
            .unwrap();
        stack_minos.iter().for_each(|stack_mino| {
            draw_mino(
                &mut canvas,
                &stack_mino.mino,
                stack_mino.x,
                stack_mino.y,
                false,
            );
        });

        let mino = game.tetriminoes[index].to_vec();
        let bottom_y = draw_mino(&mut canvas, &mino, position_x, position_y, is_rotate);
        canvas.present();

        counter += 1;
        if counter > 60 {
            // 落下処理
            if STAGE_Y + STAGE_HEIGHT as i32 > bottom_y + BLOCK_SIZE as i32 {
                position_y += BLOCK_SIZE as i32;
                counter = 0;
            }
        }
        // 次のテトリミノを出す
        if bottom_y + BLOCK_SIZE as i32 >= STAGE_Y + STAGE_HEIGHT as i32 {
            let stack_mino = StackMino {
                mino: mino.to_vec(),
                x: position_x,
                y: position_y,
            };
            stack_minos.push(stack_mino);
            position_x = STAGE_X;
            position_y = STAGE_Y;
            index = rng.gen::<usize>() % 4 as usize;
        }

        let end = Instant::now();
        let elapsed = end.duration_since(start);
        if elapsed < frame_duration {
            ::std::thread::sleep(frame_duration - elapsed);
        }
    }
}

fn rotate(x: i32, y: i32) -> (i32, i32) {
    let new_x = if y > 3 { y - 3 } else { 3 - y };
    let new_y = x;
    (new_x, new_y)
}

fn draw_mino(
    canvas: &mut WindowCanvas,
    mino: &Tetrimino,
    position_x: i32,
    position_y: i32,
    is_rotate: bool,
) -> i32 {
    let mut bottom_y = 0;
    mino.iter().enumerate().for_each(|(i, arr)| {
        arr.iter().enumerate().for_each(|(j, on)| {
            if on.eq(&(1 as u8)) {
                let x_side = if is_rotate {
                    if i > 3 {
                        i - 3
                    } else {
                        3 - i
                    }
                } else {
                    j
                };
                let y_side = if is_rotate { j } else { i };
                let x = position_x + x_side as i32 * BLOCK_SIZE as i32;
                let y = position_y + y_side as i32 * BLOCK_SIZE as i32;
                if bottom_y < y {
                    bottom_y = y;
                }
                canvas.set_draw_color(Color::WHITE);
                canvas
                    .fill_rect(Rect::new(x, y, BLOCK_SIZE, BLOCK_SIZE))
                    .unwrap();
            }
        });
    });
    bottom_y
}
